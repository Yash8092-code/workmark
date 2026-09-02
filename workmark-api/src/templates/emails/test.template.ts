import { renderBaseTemplate } from './base.layout';

export interface TestEmailData {
  to: string;
}

export const generateTestEmail = ({ to }: TestEmailData): { subject: string; html: string; text: string } => {
  const subject = 'Workmark Email Test';
  const previewText = 'This is a test email confirming your Workmark Resend email integration is working properly.';

  const content = `
    <h1 style="font-size: 22px; font-weight: 700; color: #172033; margin-top: 0; margin-bottom: 16px;">
      Welcome to Workmark!
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      This is a test email from the Workmark backend service.
    </p>

    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #065F46;">
        ✅ Resend Integration Status: Operational
      </p>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #047857;">
        If you received this email at <strong>${to}</strong>, the Resend integration and API key configuration are working correctly.
      </p>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94A3B8; margin-top: 24px;">
      Timestamp: ${new Date().toISOString()}
    </p>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  const text = `
Welcome to Workmark!

This is a test email from the Workmark backend.

If you received this email, the Resend integration is working correctly.

Timestamp: ${new Date().toISOString()}
  `.trim();

  return { subject, html, text };
};
