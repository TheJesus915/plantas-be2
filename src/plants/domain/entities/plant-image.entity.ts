export class PlantImageEntity {
  id: string;
  catalog_id: string;
  image_url: string;
  created_at: Date;

  constructor(props: {
    id?: string;
    catalog_id: string;
    image_url: string;
    created_at?: Date;
  }) {
    this.id = props.id || '';
    this.catalog_id = props.catalog_id;
    this.image_url = props.image_url;
    this.created_at = props.created_at || new Date();
  }
}