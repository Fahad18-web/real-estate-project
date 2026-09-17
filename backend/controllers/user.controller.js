import { User } from '../models/User.model.js';
import { SavedProperty } from '../models/SavedProperty.model.js';
import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const uploadImageToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-refreshToken');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return res.status(200).json(new ApiResponse(200, user, 'Profile retrieved'));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    if (req.file) {
      updates.avatar = await uploadImageToCloudinary(
        req.file.buffer,
        `estatepulse/avatars/${req.user._id}`
      );
    } else if (avatar) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-refreshToken');

    return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await SavedProperty.deleteMany({ user: req.user._id });
    return res.status(200).json(new ApiResponse(200, {}, 'Account deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getSavedProperties = async (req, res, next) => {
  try {
    const saved = await SavedProperty.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'agent', select: 'name email phone avatar' },
      })
      .lean();

    const properties = saved
      .filter((item) => item.property !== null)
      .map((item) => item.property);

    return res.status(200).json(new ApiResponse(200, properties, 'Saved properties retrieved'));
  } catch (error) {
    next(error);
  }
};

export const saveProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const existing = await SavedProperty.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      return res.status(200).json(new ApiResponse(200, existing, 'Property already in saved list'));
    }

    const saved = await SavedProperty.create({
      user: req.user._id,
      property: propertyId,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedProperties: propertyId },
    });

    return res.status(201).json(new ApiResponse(201, saved, 'Property saved successfully'));
  } catch (error) {
    next(error);
  }
};

export const unsaveProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    await SavedProperty.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedProperties: propertyId },
    });

    return res.status(200).json(new ApiResponse(200, {}, 'Property removed from saved'));
  } catch (error) {
    next(error);
  }
};
