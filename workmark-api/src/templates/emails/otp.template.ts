import { renderBaseTemplate } from './base.layout';

export interface OTPTemplateData {
  name: string;
  otp: string;
  expiresInMinutes?: number;
}

export const generateOTPEmail = ({ name, otp, expiresInMinutes = 10 }: OTPTemplateData): { subject: string; html: string; text: string } => {
  const subject = 'Verify your Workmark account';
  const previewText = `Your Workmark verification code is ${otp}. Valid for ${expiresInMinutes} minutes.`;

  const content = `
    <h1 style="font-size: 22px; font-weight: 700; color: #172033; margin-top: 0; margin-bottom: 16px;">
      Welcome to Workmark, ${name}!
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
      Thank you for signing up. Please use the following 6-digit verification code to complete your registration and activate your account:
    </p>

    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748B;">
        ⏱️ This code will expire in <strong>${expiresInMinutes} minutes</strong>
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.5; color: #64748B; margin-top: 24px;">
      🔒 <strong>Security reminder:</strong> Never share this verification code with anyone. Workmark will never ask for your code over the phone or via direct message.
    </p>
    <p style="font-size: 13px; line-height: 1.5; color: #94A3B8; margin-top: 16px;">
      If you did not initiate this request, you can safely ignore this email.
    </p>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  const text = `
Welcome to Workmark, ${name}!

Your verification code is: ${otp}

This code expires in ${expiresInMinutes} minutes.

If you did not create a Workmark account, you can safely ignore this email.
  `.trim();

  return { subject, html, text };
};
