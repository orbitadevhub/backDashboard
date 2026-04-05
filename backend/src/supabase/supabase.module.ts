// supabase.module.ts
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseService } from "./supabase.service";
import { FilesController } from "./supabase.controller";
import { FileEntity } from "./entities/supabase.entity";


@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
  controllers: [FilesController]

})
export class SupabaseModule {}