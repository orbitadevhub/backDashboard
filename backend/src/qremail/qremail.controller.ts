import { Controller } from '@nestjs/common';
import { QremailService } from './qremail.service';

@Controller('qremail')
export class QremailController {
  constructor(private readonly qremailService: QremailService) {}
}
