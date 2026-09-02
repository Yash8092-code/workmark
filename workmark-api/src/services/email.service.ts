import { Resend } from 'resend';
import { generateOTPEmail, OTPTemplateData } from '../templates/emails/otp.template';
import { generatePasswordResetEmail, PasswordResetTemplateData } from '../templates/emails/password-reset.template';
import { generateApplicationStatusEmail, ApplicationStatusTemplateData } from '../templates/emails/application-status.template';
import { generateJobAlertEmail, JobAlertTemplateData } from '../templates/emails/job-alert.template';
import { generateTestEmail, TestEmailData } from '../templates/emails/test.template';

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private resend: Resend | null = null;
  private defaultFrom: string = 'Workmark <onboarding@resend.dev>';

  constructor() {
    this.init();
  }

  private init() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
    if (process.env.EMAIL_FROM) {
      this.defaultFrom = process.env.EMAIL_FROM;
    }
  }

  public async sendEmail({ to, subject, html, text }: SendEmailPayload): Promise<EmailResult> {
    if (!this.resend) {
      this.init();
    }

    if (!this.resend) {
      console.log(`[EMAIL] Warning: RESEND_API_KEY is not configured. Email suppressed for: ${to}`);
      return { success: false, error: 'RESEND_API_KEY is not configured' };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.defaultFrom,
        to,
        subject,
        html,
        text,
      });

      if (response.error) {
        console.error(`[EMAIL] Error sending email to ${to}:`, response.error.message);
        return { success: false, error: response.error.message };
      }

      return { success: true, messageId: response.data?.id };
    } catch (error: any) {
      console.error(`[EMAIL] Unexpected failure sending email to ${to}:`, error?.message || error);
      return { success: false, error: error?.message || 'Unknown email transmission error' };
    }
  }

  public async sendOTPEmail(data: { to: string } & OTPTemplateData): Promise<EmailResult> {
    const { to, ...templateData } = data;
    const { subject, html, text } = generateOTPEmail(templateData);
    const result = await this.sendEmail({ to, subject, html, text });
    if (result.success) {
      console.log(`[EMAIL] OTP sent to ${to}`);
    }
    return result;
  }

  public async sendPasswordResetEmail(data: { to: string } & PasswordResetTemplateData): Promise<EmailResult> {
    const { to, ...templateData } = data;
    const { subject, html, text } = generatePasswordResetEmail(templateData);
    const result = await this.sendEmail({ to, subject, html, text });
    if (result.success) {
      console.log(`[EMAIL] Password reset email sent to ${to}`);
    }
    return result;
  }

  public async sendApplicationStatusEmail(data: { to: string } & ApplicationStatusTemplateData): Promise<EmailResult> {
    const { to, ...templateData } = data;
    const { subject, html, text } = generateApplicationStatusEmail(templateData);
    const result = await this.sendEmail({ to, subject, html, text });
    if (result.success) {
      console.log(`[EMAIL] Application status email sent to ${to} (Status: ${templateData.status})`);
    }
    return result;
  }

  public async sendNewJobAlertEmail(data: { to: string } & JobAlertTemplateData): Promise<EmailResult> {
    const { to, ...templateData } = data;
    const { subject, html, text } = generateJobAlertEmail(templateData);
    const result = await this.sendEmail({ to, subject, html, text });
    if (result.success) {
      console.log(`[EMAIL] Job alert sent to ${to} (${templateData.jobs.length} jobs)`);
    }
    return result;
  }

  public async sendTestEmail(data: TestEmailData): Promise<EmailResult> {
    const { to } = data;
    const { subject, html, text } = generateTestEmail({ to });
    const result = await this.sendEmail({ to, subject, html, text });
    if (result.success) {
      console.log(`[EMAIL] Test email sent successfully to ${to}`);
    }
    return result;
  }
}

export const emailService = new EmailService();
export default emailService;
