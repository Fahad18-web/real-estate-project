import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: 0,
      index: true,
    },
    type: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
      index: true,
    },
    propertyType: {
      type: String,
      enum: ['house', 'apartment', 'villa', 'commercial', 'plot'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented'],
      default: 'available',
      index: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      required: [true, 'Property area (sq ft) is required'],
    },
    images: {
      type: [String],
      validate: [
        (val) => val.length <= 6,
        'Property can have a maximum of 6 images',
      ],
      default: [],
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: true, index: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'Pakistan' },
      coordinates: {
        lat: { type: Number, default: 31.5204 },
        lng: { type: Number, default: 74.3587 },
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });

export const Property = mongoose.model('Property', propertySchema);
