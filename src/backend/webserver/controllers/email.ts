import { type Express, type Request, type Response } from 'express';
import nodemailer from 'nodemailer';
import { type EmailPayload } from '../../shared/types/email';
import type { Response as ApiResponse } from '../../shared/types/response';

export const initEmailController = (app: Express) => {
  app.post('/api/email', async (req: Request, res: Response) => {
    try {
      const { to, subject, text, html, pdfBase64, pdfFilename } = req.body as EmailPayload;

      if (!to || !pdfBase64) {
        return res.status(400).json({ success: false, key: 'error.invalidRequest' });
      }

      // In production, these should be securely stored in the DB or via safe env vars
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
        attachments: [
          {
            filename: pdfFilename || 'invoice.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      const response: ApiResponse<unknown> = { success: true, data: info };
      res.json(response);
    } catch (error) {
      console.error('Email error:', error);
      const errResponse: ApiResponse<unknown> = { success: false, key: 'error.failedToSendEmail' };
      res.status(500).json(errResponse);
    }
  });
};
