import { Module } from '@nestjs/common';
import { QremailService } from './qremail.service';
import { CloudinaryModule } from 'src/config/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [QremailService],
  exports: [QremailService],
})
export class QremailModule {}
