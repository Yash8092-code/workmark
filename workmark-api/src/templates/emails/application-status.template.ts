import { renderBaseTemplate } from './base.layout';

export interface ApplicationStatusTemplateData {
  name: string;
  jobTitle: string;
  companyName: string;
  status: string;
  applicationUrl?: string;
}

const statusDisplayMap: Record<string, { label: string; color: string; bg: string; message: string }> = {
  applied: {
    label: 'Applied',
    color: '#2563EB',
    bg: '#EFF6FF',
    message: 'Your application has been received and is waiting for employer review.',
  },
  pending: {
    label: 'Pending Review',
    color: '#2563EB',
    bg: '#EFF6FF',
    message: 'Your application has been received and is waiting for employer review.',
  },
  under_review: {
    label: 'Under Review',
    color: '#D97706',
    bg: '#FEF3C7',
    message: 'The hiring team is currently reviewing your profile and application materials.',
  },
  reviewed: {
    label: 'Reviewed',
    color: '#0284C7',
    bg: '#E0F2FE',
    message: 'The hiring team has reviewed your application.',
  },
  shortlisted: {
    label: 'Shortlisted',
    color: '#7C3AED',
    bg: '#F5F3FF',
    message: 'Congratulations! You have been shortlisted for this position.',
  },
  interview: {
    label: 'Interview',
    color: '#059669',
    bg: '#ECFDF5',
    message: 'Great news! The employer would like to move forward with an interview.',
  },
  accepted: {
    label: 'Accepted / Offer Extended',
    color: '#16A34A',
    bg: '#DCFCE7',
    message: 'Congratulations! Your application has been accepted.',
  },
  hired: {
    label: 'Hired',
    color: '#16A34A',
    bg: '#DCFCE7',
    message: 'Congratulations! You have been officially selected for this role.',
  },
  rejected: {
    label: 'Not Selected',
    color: '#DC2626',
    bg: '#FEE2E2',
    message: 'Thank you for your interest. The employer has decided to pursue other candidates for this position.',
  },
};

export const generateApplicationStatusEmail = ({
  name,
  jobTitle,
  companyName,
  status,
  applicationUrl,
}: ApplicationStatusTemplateData): { subject: string; html: string; text: string } => {
  const statusKey = status.toLowerCase().replace(/[\s-]/g, '_');
  const statusInfo = statusDisplayMap[statusKey] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: '#2563EB',
    bg: '#EFF6FF',
    message: `Your application status has been updated to: ${status}.`,
  };

  const subject = `Application Update: ${jobTitle} at ${companyName}`;
  const previewText = `Your application for ${jobTitle} at ${companyName} has been moved to ${statusInfo.label}.`;

  const fallbackUrl = applicationUrl || `${process.env.CLIENT_URL || 'https://workmark.com'}/seeker/applications`;

  const content = `
    <h1 style="font-size: 22px; font-weight: 700; color: #172033; margin-top: 0; margin-bottom: 16px;">
      Application Status Update
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      Hello ${name},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
      There has been an update to your application on Workmark:
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #172033; margin: 0 0 4px 0;">
        ${jobTitle}
      </h2>
      <p style="font-size: 14px; color: #64748B; margin: 0 0 16px 0;">
        🏢 ${companyName}
      </p>

      <div style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; background-color: ${statusInfo.bg}; color: ${statusInfo.color}; margin-bottom: 12px;">
        Status: ${statusInfo.label}
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #334155; margin: 8px 0 0 0;">
        ${statusInfo.message}
      </p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${fallbackUrl}" class="button" target="_blank">View Application Details</a>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94A3B8; margin-top: 24px;">
      You can manage your notification preferences anytime from your Workmark profile settings.
    </p>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  const text = `
Hello ${name},

Your application for ${jobTitle} at ${companyName} has been updated.

New Status: ${statusInfo.label}
${statusInfo.message}

View your application on Workmark:
${fallbackUrl}
  `.trim();

  return { subject, html, text };
};
