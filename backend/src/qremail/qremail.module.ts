import { Module } from '@nestjs/common';
import { QremailService } from './qremail.service';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Module({
  imports: [CloudinaryService],
  providers: [QremailService],
  exports: [QremailService],
})
export class QremailModule {}
