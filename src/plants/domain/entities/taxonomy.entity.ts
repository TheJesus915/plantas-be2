export class TaxonomyEntity {
  id: string;
  family_id: string;
  genus_id: string;
  species_id: string;
  created_at: Date;

  constructor(props: {
    id?: string;
    family_id: string;
    genus_id: string;
    species_id: string;
    created_at?: Date;
  }) {
    this.id = props.id || '';
    this.family_id = props.family_id;
    this.genus_id = props.genus_id;
    this.species_id = props.species_id;
    this.created_at = props.created_at || new Date();
  }
}