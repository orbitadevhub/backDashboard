import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { Express } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/roles.enum';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('files')
export class FilesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post('upload')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.supabase.uploadFile(
      'documents',
      file.originalname,
      file.buffer,
      file.mimetype,
      file.size,
      file.originalname
    );
  }
}
