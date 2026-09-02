import { Router } from 'express';
import {
  getStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAdminJobs,
  removeJob,
  verifyCompany,
  getReports,
  reviewReport,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAdminJobs);
router.delete('/jobs/:id', removeJob);
router.patch('/companies/:id/verify', verifyCompany);
router.get('/reports', getReports);
router.patch('/reports/:id/review', reviewReport);

export default router;
