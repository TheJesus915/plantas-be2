import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdatePlantImageFileDto {
  @IsUUID(4, { message: 'Image ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Image ID is required' })
  imageId: string;
}