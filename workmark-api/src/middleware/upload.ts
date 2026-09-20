import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only jpg, jpeg, png, and webp images are allowed', 400));
    }
  } else {
    cb(new AppError('Not an image file', 400));
  }
};

const resumeFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
  ];
  const isAllowedExt = /\.(pdf|doc|docx)$/i.test(file.originalname);
  if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF, DOC, and DOCX files are allowed', 400));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const saveToLocalStorage = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.originalname) || (file.mimetype.includes('png') ? '.png' : file.mimetype.includes('pdf') ? '.pdf' : '.jpg');
  const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.promises.writeFile(filePath, file.buffer);

  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const cleanFolder = folder.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  return `${serverUrl}/uploads/${cleanFolder}/${uniqueName}`;
};

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
  resourceType: 'image' | 'raw' | 'auto' = 'auto'
): Promise<string> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const isCloudinaryConfigured =
    cloudName &&
    cloudName !== 'workmark' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    try {
      const resultUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result?.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Cloudinary upload returned empty result'));
            }
          }
        );

        uploadStream.end(file.buffer);
      });
      return resultUrl;
    } catch (cloudErr) {
      console.warn('Cloudinary upload failed, falling back to local file storage:', cloudErr);
    }
  }

  // Fallback to local file storage
  try {
    return await saveToLocalStorage(file, folder);
  } catch (localErr) {
    console.error('Failed to save file to local storage:', localErr);
    throw new AppError('Failed to upload file', 500);
  }
};
