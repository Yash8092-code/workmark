import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'workmark',
    });

    console.log('MongoDB connected successfully');

    // Clean up legacy problematic index if present
    try {
      const collection = mongoose.connection.collection('jobs');
      const indexes = await collection.indexes();
      const legacyIndex = indexes.find((idx: any) => idx.name === 'source_1_externalId_1');
      if (legacyIndex && !legacyIndex.partialFilterExpression) {
        console.log('Dropping legacy non-partial index source_1_externalId_1...');
        await collection.dropIndex('source_1_externalId_1');
        console.log('Legacy index dropped successfully');
      }
    } catch (indexErr) {
      console.warn('Index check skipped or collection not ready:', indexErr);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
