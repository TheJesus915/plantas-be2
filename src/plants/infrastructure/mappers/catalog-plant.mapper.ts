import { catalogplant, plantimages } from '@prisma/client';
import { CatalogPlantResponseDto } from '../../application/dtos/catalog-plant/catalog_plant-response.dto';
import { CatalogPlantListItemDto } from '../../application/dtos/catalog-plant/catalog-plant-list-item.dto';

export class CatalogPlantMapper {
  static toDto(
    plant: catalogplant,
    images?: plantimages[],
    taxonomicNode?: any,
    taxonomicAncestry?: any[]
  ): CatalogPlantResponseDto {
    return {
      id: plant.id,
      name: plant.name,
      description: plant.description || undefined,
      planttype: plant.planttype,
      mintemp: plant.mintemp || undefined,
      maxtemp: plant.maxtemp || undefined,
      minhum: plant.minhum || undefined,
      maxhum: plant.maxhum || undefined,
      WARNINGS: plant.WARNINGS || undefined,
      created_at: plant.created_at,
      images: images?.map(image => ({
        id: image.id,
        image_url: image.image_url
      })) || [],
      taxonomicNode: taxonomicNode ? {
        id: taxonomicNode.id,
        name: taxonomicNode.name,
        rank: taxonomicNode.rank
      } : undefined,
      taxonomicAncestry: taxonomicAncestry?.map(node => ({
        id: node.id,
        name: node.name,
        rank: node.rank
      }))
    };
  }

  static toListItemDto(
    plant: catalogplant & { plantimages?: plantimages[]; taxonomicNode?: any }
  ): CatalogPlantListItemDto {
    return {
      id: plant.id,
      name: plant.name,
      planttype: plant.planttype,
      image: plant.plantimages && plant.plantimages.length > 0 ? {
        id: plant.plantimages[0].id,
        image_url: plant.plantimages[0].image_url
      } : undefined
    };
  }

}