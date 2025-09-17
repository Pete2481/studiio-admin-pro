import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';

const prisma = new PrismaClient();

interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromEmail: string;
  active: boolean;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private async getTenantSmtpSettings(tenantId: string): Promise<SmtpSettings | null> {
    try {
      const tenantSettings = await prisma.tenantSettings.findUnique({
        where: { tenantId }
      });

      if (!tenantSettings?.smtpSettings) {
        return null;
      }

      return JSON.parse(tenantSettings.smtpSettings);
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
      return null;
    }
  }

  private async sendEmailWithSmtp(smtpSettings: SmtpSettings, emailOptions: EmailOptions): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpSettings.host,
        port: smtpSettings.port,
        secure: smtpSettings.secure,
        auth: {
          user: smtpSettings.auth.user,
          pass: smtpSettings.auth.pass,
        },
      });

      const mailOptions = {
        from: smtpSettings.fromEmail,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOtpEmail(tenantId: string, email: string, otp: string, tenantName: string): Promise<boolean> {
    const smtpSettings = await this.getTenantSmtpSettings(tenantId);
    
    if (!smtpSettings || !smtpSettings.active) {
      console.log('No active SMTP settings found for tenant, falling back to console log');
      console.log(`OTP for ${email}: ${otp}`);
      return false;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Login Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #e9f9f0; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #065f46; text-align: center; padding: 20px; background-color: #f0fdf4; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${tenantName}</h1>
            <p>Your Login Verification Code</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested a login code for your ${tenantName} account. Use the code below to sign in:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This email was sent from ${tenantName}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ${tenantName} - Login Verification Code
      
      Hello,
      
      You requested a login code for your ${tenantName} account. Use the code below to sign in:
      
      ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
      
      This email was sent from ${tenantName}
    `;

    return await this.sendEmailWithSmtp(smtpSettings, {
      to: email,
      subject: `Your ${tenantName} Login Code`,
      html,
      text
    });
  }

  async sendNotificationEmail(tenantId: string, email: string, subject: string, message: string, tenantName: string): Promise<boolean> {
    const smtpSettings = await this.getTenantSmtpSettings(tenantId);
    
    if (!smtpSettings || !smtpSettings.active) {
      console.log('No active SMTP settings found for tenant');
      return false;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #e9f9f0; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${tenantName}</h1>
            <p>${subject}</p>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            <p>This email was sent from ${tenantName}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmailWithSmtp(smtpSettings, {
      to: email,
      subject: `${subject} - ${tenantName}`,
      html
    });
  }

  async sendTestEmail(tenantId: string, to: string, tenantName: string): Promise<boolean> {
    console.log('sendTestEmail called with:', { tenantId, to, tenantName });
    const smtpSettings = await this.getTenantSmtpSettings(tenantId);
    console.log('Retrieved SMTP settings:', smtpSettings);
    
    if (!smtpSettings || !smtpSettings.active) {
      console.log('No active SMTP settings found for tenant');
      return false;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #e9f9f0; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #fff; padding: 30px; border: 1px solid #ddd; }
          .footer { background-color: #f8f8f8; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #777; }
          h1 { color: #065f46; margin: 0; }
          .test-info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${tenantName} - SMTP Test</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>This is a test email from your ${tenantName} SMTP configuration.</p>
            <div class="test-info">
              <p><strong>Your SMTP settings are working correctly!</strong></p>
              <p>Settings used:</p>
              <ul>
                <li><strong>Host:</strong> ${smtpSettings.host}</li>
                <li><strong>Port:</strong> ${smtpSettings.port}</li>
                <li><strong>Secure:</strong> ${smtpSettings.secure ? 'Yes' : 'No'}</li>
                <li><strong>From Email:</strong> ${smtpSettings.fromEmail}</li>
              </ul>
            </div>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <p>Regards,<br/>The ${tenantName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmailWithSmtp(smtpSettings, {
      to,
      subject: `SMTP Test Email from ${tenantName}`,
      html
    });
  }
}

export const emailService = new EmailService();
