import { Router } from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    validateRequest,
  ],
  createBooking
);

router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put(
  '/:id/status',
  authorizeRoles('agent', 'admin'),
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Valid status is required'),
    validateRequest,
  ],
  updateBookingStatus
);
router.delete('/:id', cancelBooking);

export default router;
