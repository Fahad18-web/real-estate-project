import { Property } from '../models/Property.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import cloudinary from '../config/cloudinary.js';

export const getProperties = async (req, res, next) => {
  try {
    const {
      type,
      propertyType,
      status,
      minPrice,
      maxPrice,
      city,
      bedrooms,
      bathrooms,
      search,
      sortBy = 'newest',
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (propertyType) query.propertyType = propertyType;
    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
    }

    if (city) {
      query['location.city'] = { $regex: new RegExp(city, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sortBy === 'price-asc') sortOptions.price = 1;
    else if (sortBy === 'price-desc') sortOptions.price = -1;
    else if (sortBy === 'oldest') sortOptions.createdAt = 1;
    else sortOptions.createdAt = -1; // newest

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const skip = (pageNum - 1) * limitNum;

    const [total, properties] = await Promise.all([
      Property.countDocuments(query),
      Property.find(query)
        .populate('agent', 'name email phone avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          properties,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        'Properties fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id)
      .populate('agent', 'name email phone avatar')
      .lean();

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, property, 'Property retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      type,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      location,
      amenities,
      images,
    } = req.body;

    let imageUrls = Array.isArray(images) ? images : [];

    // Handle uploaded files via multer if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'real-estate' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...uploadedUrls].slice(0, 6);
    }

    if (imageUrls.length === 0) {
      imageUrls = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ];
    }

    const parsedLocation =
      typeof location === 'string' ? JSON.parse(location) : location;
    const parsedAmenities =
      typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      type,
      propertyType,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area),
      images: imageUrls,
      location: parsedLocation,
      amenities: parsedAmenities || [],
      agent: req.user._id,
    });

    const populatedProperty = await Property.findById(property._id).populate(
      'agent',
      'name email phone avatar'
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, populatedProperty, 'Property created successfully')
      );
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (
      property.agent.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to update this property');
    }

    const updates = { ...req.body };
    if (updates.location && typeof updates.location === 'string') {
      updates.location = JSON.parse(updates.location);
    }
    if (updates.amenities && typeof updates.amenities === 'string') {
      updates.amenities = JSON.parse(updates.amenities);
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('agent', 'name email phone avatar');

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProperty, 'Property updated successfully')
      );
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (
      property.agent.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to delete this property');
    }

    await Property.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Property deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAgentProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ agent: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res
      .status(200)
      .json(
        new ApiResponse(200, properties, 'Agent properties fetched successfully')
      );
  } catch (error) {
    next(error);
  }
};
