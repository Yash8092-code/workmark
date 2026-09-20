import mongoose, { Schema } from 'mongoose';
import { IJobs } from '../types';

const jobSchema = new Schema<IJobs>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: { type: String, trim: true },
    companyLogo: { type: String },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      trim: true,
    },
    responsibilities: [{
      type: String,
      trim: true,
    }],
    requirements: [{
      type: String,
      trim: true,
    }],
    skills: [{
      type: String,
      trim: true,
    }],
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'unknown'],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly',
      },
    },
    benefits: [{
      type: String,
      trim: true,
    }],
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'expired'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    country: { type: String, default: 'Unknown', trim: true },
    countryCode: { type: String, default: 'unknown', lowercase: true, trim: true },
    source: { type: String, enum: ['workmark', 'adzuna'], default: 'workmark', index: true },
    isExternal: { type: Boolean, default: false, index: true },
    externalId: { type: String, index: true, sparse: true },
    externalUrl: { type: String },
    sourceName: { type: String },
    salaryIsPredicted: { type: Boolean },
    lastSyncedAt: { type: Date },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ status: 1, category: 1, workMode: 1, employmentType: 1, experienceLevel: 1, createdAt: -1 });
jobSchema.index({ employerId: 1 });
jobSchema.index({ companyId: 1 });
jobSchema.index(
  { source: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: { externalId: { $type: 'string' } },
  }
);
jobSchema.index({ countryCode: 1, status: 1, postedAt: -1 });

export default mongoose.model<IJobs>('Job', jobSchema);
