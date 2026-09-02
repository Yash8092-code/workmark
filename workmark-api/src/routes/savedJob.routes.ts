import { Router } from 'express';
import {
  saveJob,
  getSavedJobs,
  unsaveJob,
} from '../controllers/savedJob.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/:jobId', saveJob);
router.get('/', getSavedJobs);
router.delete('/:jobId', unsaveJob);

export default router;
