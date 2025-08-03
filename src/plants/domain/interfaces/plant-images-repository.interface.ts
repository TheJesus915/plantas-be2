import { plantimages } from '@prisma/client';

export interface IPlantImagesRepository {
  create(imageData: Omit<plantimages, 'id' | 'created_at'>): Promise<plantimages>;
  createMany(imagesData: Omit<plantimages, 'id' | 'created_at'>[]): Promise<{ count: number }>;
  findById(id: string): Promise<plantimages | null>;
  findByCatalogId(catalogId: string): Promise<plantimages[]>;
  delete(id: string): Promise<plantimages>;
  uploadAndCreate(file: Express.Multer.File, catalogId: string): Promise<{ imageUrl: string, imageData: plantimages }>;
  updateImageFile(imageId: string, file: Express.Multer.File): Promise<plantimages>;
}