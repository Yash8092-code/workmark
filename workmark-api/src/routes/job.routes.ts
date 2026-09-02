import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getEmployerJobs,
  getFeaturedJobs,
} from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createJobSchema, updateJobSchema } from '../validators/job.validator';

const router = Router();

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/:id', getJob);

router.use(authenticate);
router.use(authorize('employer'));

router.post('/', validate(createJobSchema), createJob);
router.get('/employer/my-jobs', getEmployerJobs);
router.put('/:id', validate(updateJobSchema), updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/status', updateJobStatus);

export default router;
