import mongoose, { Schema } from 'mongoose';
import { ISavedJob } from '../types';

const savedJobSchema = new Schema<ISavedJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<ISavedJob>('SavedJob', savedJobSchema);
