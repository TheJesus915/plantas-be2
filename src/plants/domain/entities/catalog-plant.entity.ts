import { PlantImageEntity } from './plant-image.entity';
import { TaxonomyEntity } from './taxonomy.entity';


export class CatalogPlantEntity {
  id: string;
  name: string;
  description?: string | null;
  planttype: string;
  mintemp?: number | null;
  maxtemp?: number | null;
  minhum?: number | null;
  maxhum?: number | null;
  WARNINGS?: string | null;
  created_at: Date;
  taxonomicNodeId?: string | null;

  images?: PlantImageEntity[];
  taxonomy?: TaxonomyEntity;

  constructor(props: {
    id?: string;
    name: string;
    description?: string | null;
    planttype: string;
    mintemp?: number | null;
    maxtemp?: number | null;
    minhum?: number | null;
    maxhum?: number | null;
    WARNINGS?: string | null;
    created_at?: Date;
    taxonomicNodeId?: string | null;
  }) {
    this.id = props.id || '';
    this.name = props.name;
    this.description = props.description || null;
    this.planttype = props.planttype;
    this.mintemp = props.mintemp || null;
    this.maxtemp = props.maxtemp || null;
    this.minhum = props.minhum || null;
    this.maxhum = props.maxhum || null;
    this.WARNINGS = props.WARNINGS || null;
    this.created_at = props.created_at || new Date();
    this.taxonomicNodeId = props.taxonomicNodeId || null;
  }
}