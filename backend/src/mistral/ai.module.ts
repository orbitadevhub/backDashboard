import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { MistralApiConfig } from './ai.service';

@Module({
  controllers: [AiController],
  providers: [AiController, MistralApiConfig],
})
export class AiModule {}
