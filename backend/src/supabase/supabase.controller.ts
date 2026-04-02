import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SupabaseService } from "../supabase/supabase.service";
import { Express } from "express";

@Controller("files")
export class FilesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.supabase.uploadFile(
      "documents",
      `${Date.now()}-${file.originalname}`,                           
      file.buffer,
      file.mimetype
    );
  }
}