import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MistralApiConfig } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly mistralService: MistralApiConfig) {}

  @Post()
  async generate(@Body('prompt') prompt: string) {
    console.log('Received prompt:', prompt);
    const response = await this.mistralService.generateResponse(prompt);
console.log(response);
    return {
      response,
    };
  }
}
