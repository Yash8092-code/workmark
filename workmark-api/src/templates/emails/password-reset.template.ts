import { renderBaseTemplate } from './base.layout';

export interface PasswordResetTemplateData {
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export const generatePasswordResetEmail = ({
  name,
  resetUrl,
  expiresInMinutes = 10,
}: PasswordResetTemplateData): { subject: string; html: string; text: string } => {
  const subject = 'Reset your Workmark password';
  const previewText = `We received a request to reset your password on Workmark. Link valid for ${expiresInMinutes} minutes.`;

  const content = `
    <h1 style="font-size: 22px; font-weight: 700; color: #172033; margin-top: 0; margin-bottom: 16px;">
      Password Reset Request
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      Hello ${name},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
      We received a request to reset the password for your Workmark account. Click the button below to set a new password:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button" target="_blank">Reset My Password</a>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin-top: 20px;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a href="${resetUrl}" style="color: #2563EB; word-break: break-all;">${resetUrl}</a>
    </p>

    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin-top: 24px;">
      <p style="margin: 0; font-size: 13px; color: #92400E;">
        ⚠️ This password reset link is valid for <strong>${expiresInMinutes} minutes</strong> and can only be used once.
      </p>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94A3B8; margin-top: 24px;">
      If you did not request a password reset, you can safely ignore this email or reach out to support if you have security concerns.
    </p>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  const text = `
Hello ${name},

We received a request to reset your password on Workmark.

Please visit the link below to set a new password:
${resetUrl}

This link is valid for ${expiresInMinutes} minutes.

If you did not request a password reset, you can safely ignore this email.
  `.trim();

  return { subject, html, text };
};
