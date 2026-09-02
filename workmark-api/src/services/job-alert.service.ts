import User from '../models/User';
import { IJobs, IUser } from '../types';
import emailService from './email.service';
import { JobAlertItem } from '../templates/emails/job-alert.template';

export class JobAlertService {
  /**
   * Matches a job against a user's alert preferences.
   * Returns true if the job is relevant to the user.
   */
  private matchJobForUser(job: Partial<IJobs>, user: IUser): boolean {
    const prefs = user.jobAlertPreferences;
    if (!prefs) return false;

    const hasKeywords = Array.isArray(prefs.keywords) && prefs.keywords.length > 0;
    const hasLocations = Array.isArray(prefs.locations) && prefs.locations.length > 0;
    const hasCountries = Array.isArray(prefs.countries) && prefs.countries.length > 0;
    const hasCategories = Array.isArray(prefs.categories) && prefs.categories.length > 0;
    const hasEmploymentTypes = Array.isArray(prefs.employmentTypes) && prefs.employmentTypes.length > 0;
    const hasWorkModes = Array.isArray(prefs.workModes) && prefs.workModes.length > 0;
    const hasExperienceLevels = Array.isArray(prefs.experienceLevels) && prefs.experienceLevels.length > 0;

    const hasAnyPreference =
      hasKeywords ||
      hasLocations ||
      hasCountries ||
      hasCategories ||
      hasEmploymentTypes ||
      hasWorkModes ||
      hasExperienceLevels;

    // If user has not set any preferences, do not send unsolicited alerts
    if (!hasAnyPreference) {
      return false;
    }

    const jobTitle = (job.title || '').toLowerCase();
    const jobDesc = (job.description || '').toLowerCase();
    const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
    const jobCategory = (job.category || '').toLowerCase();
    const jobLocation = (job.location || '').toLowerCase();
    const jobCountry = (job.country || '').toLowerCase();
    const jobCountryCode = (job.countryCode || '').toLowerCase();

    // Check Keywords (at least one must match if specified)
    if (hasKeywords) {
      const keywordMatch = prefs.keywords!.some((kw) => {
        const k = kw.trim().toLowerCase();
        if (!k) return false;
        return (
          jobTitle.includes(k) ||
          jobDesc.includes(k) ||
          jobCategory.includes(k) ||
          jobSkills.some((s) => s.includes(k))
        );
      });
      if (!keywordMatch) return false;
    }

    // Check Countries
    if (hasCountries) {
      const countryMatch = prefs.countries!.some((c) => {
        const target = c.trim().toLowerCase();
        return jobCountry.includes(target) || jobCountryCode === target;
      });
      if (!countryMatch) return false;
    }

    // Check Locations
    if (hasLocations) {
      const locationMatch = prefs.locations!.some((loc) => {
        const target = loc.trim().toLowerCase();
        return jobLocation.includes(target) || jobCountry.includes(target);
      });
      if (!locationMatch) return false;
    }

    // Check Categories
    if (hasCategories) {
      const categoryMatch = prefs.categories!.some((cat) => {
        const target = cat.trim().toLowerCase();
        return jobCategory.includes(target);
      });
      if (!categoryMatch) return false;
    }

    // Check Employment Types
    if (hasEmploymentTypes) {
      const typeMatch = prefs.employmentTypes!.some((t) => t.toLowerCase() === (job.employmentType || '').toLowerCase());
      if (!typeMatch) return false;
    }

    // Check Work Modes
    if (hasWorkModes) {
      const modeMatch = prefs.workModes!.some((m) => m.toLowerCase() === (job.workMode || '').toLowerCase());
      if (!modeMatch) return false;
    }

    // Check Experience Levels
    if (hasExperienceLevels) {
      const levelMatch = prefs.experienceLevels!.some((l) => l.toLowerCase() === (job.experienceLevel || '').toLowerCase());
      if (!levelMatch) return false;
    }

    return true;
  }

  /**
   * Evaluates newly imported or posted jobs and sends email alerts to matching users.
   */
  public async processJobAlertsForNewJobs(newJobs: Array<Partial<IJobs>>): Promise<number> {
    if (!newJobs || newJobs.length === 0) return 0;

    try {
      // Find active, verified users who have newJobs alerts enabled
      const users = await User.find({
        isVerified: true,
        isActive: true,
        'emailNotifications.newJobs': { $ne: false },
      });

      if (!users || users.length === 0) return 0;

      let emailsSent = 0;

      for (const user of users) {
        const matchingJobs = newJobs.filter((job) => this.matchJobForUser(job, user));

        if (matchingJobs.length === 0) continue;

        // Limit to 5 most relevant jobs per email
        const topJobs: JobAlertItem[] = matchingJobs.slice(0, 5).map((job) => {
          let salaryText: string | undefined;
          if (job.salary?.min || job.salary?.max) {
            const currency = job.salary.currency || 'USD';
            const min = job.salary.min ? `${currency} ${job.salary.min.toLocaleString()}` : '';
            const max = job.salary.max ? `${currency} ${job.salary.max.toLocaleString()}` : '';
            salaryText = min && max ? `${min} - ${max}` : min || max;
          }

          const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
          const jobUrl = job._id
            ? `${clientUrl}/jobs/${job._id}`
            : job.externalUrl || `${clientUrl}/jobs`;

          return {
            id: job._id?.toString(),
            title: job.title || 'Untitled Role',
            companyName: job.companyName || 'Company',
            location: job.location || 'Location unavailable',
            country: job.country,
            workMode: job.workMode,
            employmentType: job.employmentType,
            salaryText,
            url: jobUrl,
          };
        });

        await emailService.sendNewJobAlertEmail({
          to: user.email,
          name: user.name,
          jobs: topJobs,
          managePreferencesUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/seeker/profile/edit`,
        });

        emailsSent += 1;
      }

      console.log(`[JOB ALERTS] Processed ${newJobs.length} new jobs, dispatched ${emailsSent} alert email(s).`);
      return emailsSent;
    } catch (error) {
      console.error('[JOB ALERTS] Error processing job alerts:', error);
      return 0;
    }
  }
}

export const jobAlertService = new JobAlertService();
export default jobAlertService;
