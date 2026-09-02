import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateApplicationStatus,
} from '../controllers/application.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { applySchema, updateStatusSchema } from '../validators/application.validator';

const router = Router();

router.use(authenticate);

router.post('/:jobId', validate(applySchema), applyToJob);
router.get('/my-applications', getMyApplications);
router.get('/job/:jobId', getJobApplications);
router.get('/:id', getApplication);
router.patch('/:id/status', validate(updateStatusSchema), updateApplicationStatus);

export default router;
