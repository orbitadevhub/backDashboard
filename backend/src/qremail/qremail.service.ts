import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class QremailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send2FAQRCode(email: string, qrBase64: string) {
    const base64Data = qrBase64.replace(/^data:image\/png;base64,/, '');

    await this.transporter.sendMail({
      from: `"MiApp Seguridad" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Activación de doble factor (2FA)',
      html: `
      <h3>Activación de doble factor</h3>
      <p>Escaneá este código con Google Authenticator o Authy:</p>
      <img src="cid:qrcode" />
      <p><strong>No compartas este código.</strong></p>
    `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'qrcode',
        },
      ],
    });
  }
}
