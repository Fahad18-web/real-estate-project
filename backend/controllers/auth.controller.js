import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const assignedRole = ['user', 'agent', 'admin'].includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      ...(avatar ? { avatar } : {}),
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select('-refreshToken');

    return res
      .status(201)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          201,
          { user: createdUser, accessToken },
          'User registered successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select('-refreshToken');

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken },
          'Logged in successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: '' });
    }

    return res
      .status(200)
      .clearCookie('refreshToken', cookieOptions)
      .json(new ApiResponse(200, {}, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'
      );
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is invalid or has been revoked');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const safeUser = await User.findById(user._id).select('-refreshToken');

    return res
      .status(200)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, user: safeUser },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-refreshToken');
    return res.status(200).json(new ApiResponse(200, user, 'Current user fetched'));
  } catch (error) {
    next(error);
  }
};
