import { plantimages } from '@prisma/client';

export class PlantImagesMapper {

  static toDomain(dto: any): Omit<plantimages, 'id' | 'created_at'> {
    return {
      catalog_id: dto.catalogId,
      image_url: dto.imageUrl
    };
  }

  static toDomainMany(dtos: any[]): Omit<plantimages, 'id' | 'created_at'>[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}