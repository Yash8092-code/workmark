import { renderBaseTemplate } from './base.layout';

export interface JobAlertItem {
  id?: string;
  title: string;
  companyName: string;
  location: string;
  country?: string;
  workMode?: string;
  employmentType?: string;
  salaryText?: string;
  url?: string;
}

export interface JobAlertTemplateData {
  name: string;
  jobs: JobAlertItem[];
  managePreferencesUrl?: string;
}

export const generateJobAlertEmail = ({
  name,
  jobs,
  managePreferencesUrl,
}: JobAlertTemplateData): { subject: string; html: string; text: string } => {
  const jobCount = jobs.length;
  const subject = `New jobs matching your Workmark preferences (${jobCount})`;
  const previewText = `We found ${jobCount} new job ${jobCount === 1 ? 'opportunity' : 'opportunities'} matching your preferences on Workmark.`;

  const baseUrl = process.env.CLIENT_URL || 'https://workmark.com';
  const prefUrl = managePreferencesUrl || `${baseUrl}/seeker/profile/edit`;

  const jobsHtml = jobs
    .map((job) => {
      const jobUrl = job.url || `${baseUrl}/jobs/${job.id || ''}`;
      const locationText = [job.location, job.country]
        .filter((v, i, a) => v && a.indexOf(v) === i)
        .join(', ') || 'Location unavailable';

      const workModeDisplay = job.workMode && job.workMode !== 'unknown'
        ? job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)
        : null;

      const employmentTypeDisplay = job.employmentType
        ? job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)
        : null;

      return `
        <div class="job-card" style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 16px; background-color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h3 style="font-size: 17px; font-weight: 700; color: #172033; margin: 0 0 4px 0;">
              <a href="${jobUrl}" style="color: #172033; text-decoration: none;" target="_blank">${job.title}</a>
            </h3>
          </div>
          <p style="font-size: 14px; font-weight: 500; color: #475569; margin: 0 0 12px 0;">
            🏢 ${job.companyName}
          </p>
          <div style="margin-bottom: 12px; font-size: 13px; color: #64748B;">
            <span style="margin-right: 14px;">📍 ${locationText}</span>
            ${workModeDisplay ? `<span style="margin-right: 14px;">🌐 ${workModeDisplay}</span>` : ''}
            ${employmentTypeDisplay ? `<span style="margin-right: 14px;">💼 ${employmentTypeDisplay}</span>` : ''}
          </div>
          ${job.salaryText ? `<p style="font-size: 14px; font-weight: 600; color: #16A34A; margin: 0 0 14px 0;">💰 ${job.salaryText}</p>` : ''}
          <div>
            <a href="${jobUrl}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF !important; font-weight: 600; font-size: 13px; text-decoration: none; padding: 8px 18px; border-radius: 6px;" target="_blank">
              View Job →
            </a>
          </div>
        </div>
      `;
    })
    .join('');

  const content = `
    <h1 style="font-size: 22px; font-weight: 700; color: #172033; margin-top: 0; margin-bottom: 16px;">
      Fresh Opportunities for You
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      Hi ${name},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
      We found new job openings matching your preferences and skill profile on Workmark:
    </p>

    <div style="margin-bottom: 24px;">
      ${jobsHtml}
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${baseUrl}/jobs" class="button" target="_blank">Browse All Available Jobs</a>
    </div>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 14px; text-align: center; margin-top: 28px;">
      <p style="margin: 0; font-size: 12px; color: #64748B;">
        Want to tune your alerts? <a href="${prefUrl}" style="color: #2563EB; font-weight: 600;">Manage your job alert preferences</a> anytime.
      </p>
    </div>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  const textJobs = jobs
    .map(
      (job) =>
        `- ${job.title} at ${job.companyName} (${job.location}${job.country ? `, ${job.country}` : ''})\n  Link: ${job.url || `${baseUrl}/jobs/${job.id || ''}`}`
    )
    .join('\n\n');

  const text = `
Hi ${name},

We found ${jobCount} new opportunities matching your preferences on Workmark:

${textJobs}

Browse all jobs: ${baseUrl}/jobs
Manage preferences: ${prefUrl}
  `.trim();

  return { subject, html, text };
};
