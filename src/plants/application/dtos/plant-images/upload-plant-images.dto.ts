import { IsArray, ArrayMaxSize } from 'class-validator';

export class UploadPlantImagesDto {
  @IsArray({ message: 'Files must be an array' })
  @ArrayMaxSize(5, { message: 'Maximum 5 images allowed' })
  files: Express.Multer.File[];
}