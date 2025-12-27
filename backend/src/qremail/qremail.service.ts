import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class QremailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async send2FAQRCode(email: string, qrBase64: string) {
    const base64Data = qrBase64.replace(/^data:image\/png;base64,/, '');

    await this.resend.emails.send({
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
        },
      ],
    });
  }
}
