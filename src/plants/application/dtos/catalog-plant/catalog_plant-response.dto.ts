export class CatalogPlantResponseDto {
  id: string;
  name: string;
  description?: string;
  planttype: string;
  mintemp?: number;
  maxtemp?: number;
  minhum?: number;
  maxhum?: number;
  WARNINGS?: string;
  created_at: Date;
  images: {
    id: string;
    image_url: string;
  }[];
  taxonomicNode?: {
    id: string;
    name: string;
    rank: string;
  };
  taxonomicAncestry?: {
    id: string;
    name: string;
    rank: string;
  }[];
}