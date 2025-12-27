import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Injectable()
export class QremailService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  private resend = new Resend(process.env.RESEND_API_KEY);

  async send2FAQRCode(email: string, qrBase64: string) {
    const upload = await this.cloudinaryService.uploadBase64Image(
      qrBase64,
      '2fa'
    );

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Activación de doble factor (2FA)',
      html: `
        <h3>Activación de doble factor</h3>
        <p>Escaneá este código:</p>
        <img src="${upload.secure_url}" width="250" />
        <p><strong>No compartas este código.</strong></p>
      `,
    });
  }
}
