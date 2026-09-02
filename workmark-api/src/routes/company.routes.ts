import { Router } from 'express';
import {
  createCompany,
  getCompanies,
  getMyCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  uploadLogo,
  uploadCover,
} from '../controllers/company.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCompanySchema, updateCompanySchema } from '../validators/company.validator';
import { uploadImage } from '../middleware/upload';

const router = Router();

router.get('/', getCompanies);
router.get('/mine', authenticate, authorize('employer'), getMyCompany);
router.get('/:id', getCompany);

router.use(authenticate);
router.use(authorize('employer'));

router.post('/', validate(createCompanySchema), createCompany);
router.put('/:id', validate(updateCompanySchema), updateCompany);
router.delete('/:id', deleteCompany);
router.post('/:id/logo', uploadImage.single('logo'), uploadLogo);
router.post('/:id/cover', uploadImage.single('cover'), uploadCover);

export default router;
