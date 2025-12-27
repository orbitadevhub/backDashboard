import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class QremailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async send2FAQRCode(email: string, qrBase64: string) {
    console.log('ANTES DE ENVIAR MAIL');

    await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: email,
      subject: 'Activación de doble factor (2FA)',
      html: `
        <h3>Activación de doble factor</h3>
        <img src="${qrBase64}" />
      `,
    });

    console.log('MAIL ENVIADO');
  }
}
