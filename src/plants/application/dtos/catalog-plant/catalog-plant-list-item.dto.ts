export class CatalogPlantListItemDto {
  id: string;
  name: string;
  planttype: string;
  image?: {
    id: string;
    image_url: string;
  };
}