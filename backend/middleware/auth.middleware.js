import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'default_access_secret'
    );

    const user = await User.findById(decodedToken.id).select('-refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token or user no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Access token expired'));
    }
    return next(new ApiError(401, error?.message || 'Invalid access token'));
  }
};
