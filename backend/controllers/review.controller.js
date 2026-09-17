import { Review } from '../models/Review.model.js';
import { Property } from '../models/Property.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const recalculatePropertyRating = async (propertyId) => {
  const reviews = await Review.find({ property: propertyId }).lean();
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews === 0
      ? 0
      : Number(
          (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
          ).toFixed(1)
        );

  await Property.findByIdAndUpdate(propertyId, { avgRating, totalReviews });
};

export const addReview = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this property');
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await recalculatePropertyRating(propertyId);

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name email avatar'
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, populatedReview, 'Review submitted successfully')
      );
  } catch (error) {
    next(error);
  }
};

export const getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return res
      .status(200)
      .json(new ApiResponse(200, reviews, 'Reviews retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to update this review');
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;
    await review.save();

    await recalculatePropertyRating(review.property);

    const populatedReview = await Review.findById(id).populate(
      'user',
      'name avatar'
    );

    return res
      .status(200)
      .json(new ApiResponse(200, populatedReview, 'Review updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to delete this review');
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(id);
    await recalculatePropertyRating(propertyId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Review deleted successfully'));
  } catch (error) {
    next(error);
  }
};
