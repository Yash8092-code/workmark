import emailService from '../services/email.service';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions): Promise<void> => {
  await emailService.sendEmail({ to, subject, html, text });
};
