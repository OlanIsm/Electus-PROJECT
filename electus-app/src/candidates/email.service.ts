import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Uses environment variables for SMTP config.
    // Falls back to Ethereal (fake SMTP) for demo/testing if not configured.
    const host = process.env.SMTP_HOST;

    if (host) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Demo mode: use Ethereal fake SMTP — emails are "sent" but viewable at ethereal.email
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'electus.demo@ethereal.email',
          pass: 'electus_demo_pass',
        },
      });
    }
  }

  async sendInterviewInvite(
    candidateName: string,
    candidateEmail: string,
    jobTitle: string,
    interviewDate: string,
    hrName: string,
    customMessage?: string,
  ): Promise<{ messageId: string; previewUrl?: string }> {
    const fromName = process.env.SMTP_FROM_NAME ?? 'Electus ATS';
    const fromEmail = process.env.SMTP_USER ?? 'noreply@electus.ai';

    const customMessageHtml = customMessage
      ? `
      <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #2dd4bf; border-radius: 4px; padding: 16px; margin: 20px 0; font-style: italic; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        "${customMessage}"
      </div>
      `
      : '';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0b14; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); border: 1px solid rgba(45,212,191,0.18); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0d9488, #0891b2); padding: 32px; text-align: center; }
    .header img { height: 36px; margin-bottom: 12px; }
    .header h1 { color: #fff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #94a3b8; margin-bottom: 20px; }
    .highlight { color: #2dd4bf; font-weight: 600; }
    .detail-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { color: #e2e8f0; font-weight: 500; }
    .cta { text-align: center; margin: 28px 0; }
    .cta a { background: linear-gradient(135deg, #0d9488, #0891b2); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 14px; display: inline-block; }
    .footer { padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ ELECTUS</h1>
    </div>
    <div class="body">
      <p class="greeting">Dear <span class="highlight">${candidateName}</span>,</p>
      <p style="color:#94a3b8; font-size:15px; line-height:1.7;">
        Congratulations! After reviewing your application, we are pleased to invite you to an interview for the following position:
      </p>
      ${customMessageHtml}
      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Position</span>
          <span class="detail-value">${jobTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Interview Date</span>
          <span class="detail-value">${interviewDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contact Person</span>
          <span class="detail-value">${hrName}</span>
        </div>
      </div>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7;">
        Please reply to this email to confirm your availability. We look forward to speaking with you!
      </p>
      <div class="cta">
        <a href="mailto:${fromEmail}?subject=Interview Confirmation - ${jobTitle}">Confirm My Availability</a>
      </div>
    </div>
    <div class="footer">
      This invitation was sent via <strong>Electus ATS</strong>. If you have any questions, reply directly to this email.
    </div>
  </div>
</body>
</html>`;

    const info = await this.transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: candidateEmail,
      subject: `Interview Invitation — ${jobTitle} at Electus`,
      html,
    });

    // nodemailer returns a preview URL for Ethereal demo emails
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

    return {
      messageId: info.messageId,
      previewUrl: previewUrl as string | undefined,
    };
  }
}
