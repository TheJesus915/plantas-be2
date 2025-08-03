import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeletePlantImageDto {
  @IsUUID(4, { message: 'Image ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Image ID is required' })
  imageId: string;
}