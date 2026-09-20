import mongoose, { Schema } from 'mongoose';
import { IApplication } from '../types';

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'],
      default: 'pending',
    },
    isViewedByEmployer: {
      type: Boolean,
      default: false,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    shortlistedAt: {
      type: Date,
    },
    interviewAt: {
      type: Date,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    interview: {
      status: {
        type: String,
        enum: ['scheduled', 'rescheduled', 'cancelled', 'completed'],
        default: 'scheduled',
      },
      scheduledAt: Date,
      date: String,
      time: String,
      mode: {
        type: String,
        enum: ['video', 'phone', 'onsite'],
        default: 'video',
      },
      locationOrLink: String,
      message: String,
      cancelledReason: String,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'],
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
applicationSchema.index({ applicantId: 1, createdAt: -1 });
applicationSchema.index({ employerId: 1, status: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, status: 1, createdAt: -1 });
applicationSchema.index({ employerId: 1, isViewedByEmployer: 1 });

export default mongoose.model<IApplication>('Application', applicationSchema);
