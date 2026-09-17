import { Router } from 'express';
import { body } from 'express-validator';
import {
  addReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/property/:propertyId', getPropertyReviews);

router.post(
  '/property/:propertyId',
  verifyJWT,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
    validateRequest,
  ],
  addReview
);

router.put(
  '/:id',
  verifyJWT,
  [
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
    validateRequest,
  ],
  updateReview
);

router.delete('/:id', verifyJWT, deleteReview);

export default router;
