import { Module } from '@nestjs/common';
import { QremailService } from './qremail.service';

@Module({
  providers: [QremailService],
  exports: [QremailService],
})
export class QremailModule {}
