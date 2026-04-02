// supabase.module.ts
import { Module, Global } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { FilesController } from "./supabase.controller";

@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
  controllers: [FilesController]

})
export class SupabaseModule {}