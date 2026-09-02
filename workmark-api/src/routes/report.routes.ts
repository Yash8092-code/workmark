import { Router } from 'express';
import { createReport, getReports } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/:jobId', createReport);
router.get('/', authorize('admin'), getReports);

export default router;
