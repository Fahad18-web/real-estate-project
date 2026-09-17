import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
} from '../controllers/property.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/', getProperties);
router.get('/agent/listings', verifyJWT, authorizeRoles('agent', 'admin'), getAgentProperties);
router.get('/:id', getPropertyById);

router.post(
  '/',
  verifyJWT,
  authorizeRoles('agent', 'admin'),
  upload.array('images', 6),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Valid price is required'),
    body('type').isIn(['sale', 'rent']).withMessage('Type must be sale or rent'),
    body('propertyType')
      .isIn(['house', 'apartment', 'villa', 'commercial', 'plot'])
      .withMessage('Valid propertyType is required'),
    body('area').isNumeric().withMessage('Valid area is required'),
    validateRequest,
  ],
  createProperty
);

router.put(
  '/:id',
  verifyJWT,
  authorizeRoles('agent', 'admin'),
  upload.array('images', 6),
  updateProperty
);

router.delete(
  '/:id',
  verifyJWT,
  authorizeRoles('agent', 'admin'),
  deleteProperty
);

export default router;
