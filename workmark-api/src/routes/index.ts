import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';
import applicationRoutes from './application.routes';
import savedJobRoutes from './savedJob.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';
import emailRoutes from './email.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);
router.use('/email', emailRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Workmark API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
