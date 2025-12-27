import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class QremailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async send2FAQRCode(email: string, qrBase64: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Activación de doble factor (2FA)',
      html: `
      <h3>Activación de doble factor</h3>
      <p>Escaneá este código con Google Authenticator o Authy:</p>
      <img 
        src="${qrBase64}" 
        alt="QR 2FA"
        style="width:200px;height:200px"
      />
      <p><strong>No compartas este código.</strong></p>
    `,
    });
  }
}
