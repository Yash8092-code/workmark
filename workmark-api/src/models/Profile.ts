import mongoose, { Schema } from 'mongoose';
import { IProfile } from '../types';

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    education: [{
      school: { type: String, required: true },
      degree: { type: String, required: true },
      field: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String },
    }],
    experience: [{
      company: { type: String, required: true },
      position: { type: String, required: true },
      location: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String },
    }],
    projects: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      technologies: [{ type: String }],
      link: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
    }],
    resumeUrl: {
      type: String,
    },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
      twitter: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ userId: 1 });

export default mongoose.model<IProfile>('Profile', profileSchema);
