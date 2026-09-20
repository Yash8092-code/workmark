import { Router } from 'express';
import { getSeekerDashboard, getEmployerDashboard } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/seeker', authenticate, getSeekerDashboard);
router.get('/employer', authenticate, getEmployerDashboard);

export default router;
