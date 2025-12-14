import { Module } from '@nestjs/common';
import { QremailService } from './qremail.service';
import { QremailController } from './qremail.controller';

@Module({
  controllers: [QremailController],
  providers: [QremailService],
  exports: [QremailService],
})
export class QremailModule {}
