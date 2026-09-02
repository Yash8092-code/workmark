import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
} from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/profile.validator';
import { uploadResume as uploadResumeMiddleware, uploadImage } from '../middleware/upload';

const router = Router();

router.use(authenticate);

router.get('/:userId', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.post('/resume', uploadResumeMiddleware.single('resume'), uploadResume);
router.post('/avatar', uploadImage.single('avatar'), uploadAvatar);

export default router;
