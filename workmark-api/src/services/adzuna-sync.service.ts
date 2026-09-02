import Job from '../models/Job';
import { getDefaultSearchCountries } from '../config/countries';
import { searchExternalJobs } from './adzuna.service';
import jobAlertService from './job-alert.service';
import { IJobs } from '../types';

const syncExternalJobs = async (): Promise<void> => {
  const countries = getDefaultSearchCountries();
  const results = await Promise.allSettled(countries.map((countryCode) => searchExternalJobs({
    countryCode,
    page: 1,
    limit: Number(process.env.ADZUNA_RESULTS_PER_PAGE) || 20,
  })));
  let upserted = 0;
  const newlyImportedJobs: Array<Partial<IJobs>> = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const job of result.value.jobs) {
      const existing = await Job.findOne({ source: 'adzuna', externalId: job.externalId });
      const updatedJob = await Job.findOneAndUpdate(
        { source: 'adzuna', externalId: job.externalId },
        { $set: job },
        { upsert: true, new: true, runValidators: true }
      );
      upserted += 1;
      // If the job didn't exist before, it's newly imported!
      if (!existing && updatedJob) {
        newlyImportedJobs.push(updatedJob);
      }
    }
  }

  console.log(`Adzuna sync completed: ${upserted} jobs processed (${newlyImportedJobs.length} new)`);

  if (newlyImportedJobs.length > 0) {
    void jobAlertService.processJobAlertsForNewJobs(newlyImportedJobs);
  }
};

export const startAdzunaSync = (): NodeJS.Timeout | undefined => {
  if (process.env.ADZUNA_SYNC_ENABLED !== 'true') return undefined;
  const interval = Math.max(60, Number(process.env.ADZUNA_SYNC_INTERVAL_MINUTES) || 360) * 60_000;
  void syncExternalJobs().catch(() => console.error('Adzuna sync failed'));
  return setInterval(() => {
    void syncExternalJobs().catch(() => console.error('Adzuna sync failed'));
  }, interval);
};
