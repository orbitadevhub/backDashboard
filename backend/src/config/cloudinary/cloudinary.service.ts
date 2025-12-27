import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY_CLOUDINARY,
      api_secret: process.env.API_SECRET_CLOUDINARY,
    });
  }

  async uploadBase64Image(base64: string, folder: string) {
    return cloudinary.uploader.upload(base64, {
      folder,
      resource_type: 'image',
    });
  }
}
