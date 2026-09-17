import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getSavedProperties,
  saveProperty,
  unsaveProperty,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.use(verifyJWT);

router.get('/profile', getProfile);
router.put(
  '/profile',
  upload.single('avatar'),
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    validateRequest,
  ],
  updateProfile
);
router.delete('/profile', deleteAccount);

router.get('/saved-properties', getSavedProperties);
router.post('/saved-properties/:propertyId', saveProperty);
router.delete('/saved-properties/:propertyId', unsaveProperty);

export default router;
