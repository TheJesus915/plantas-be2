import { catalogplant, plantimages } from '@prisma/client';

export interface ICatalogPlantRepository {
  create(plantData: Omit<catalogplant, 'id' | 'created_at'>): Promise<catalogplant>;

  findById(id: string): Promise<
    | (catalogplant & {
    plantimages?: plantimages[];
    taxonomicNode?: any;
  })
    | null
  >;

  findByName(name: string): Promise<catalogplant | null>;

  update(id: string, plantData: Partial<catalogplant>): Promise<catalogplant>;

  delete(id: string): Promise<catalogplant>;

  findAll(page: number, limit: number): Promise<{ plants: catalogplant[]; total: number }>;

  findAllPaginated(
    where: any,
    skip: number,
    take: number,
    orderBy: any
  ): Promise<{ plants: any[]; total: number }>;

  getTaxonomicAncestry(nodeId: string): Promise<any[]>;

  checkPlantWithTaxonomicNode(
    taxonomicNodeId: string,
    excludeCatalogId?: string
  ): Promise<{ exists: boolean; plantName?: string }>;

  isPlantInUse(id: string): Promise<boolean>;
}