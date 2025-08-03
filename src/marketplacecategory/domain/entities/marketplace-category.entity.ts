export class MarketplaceCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly image_url: string | null,
    public readonly is_active: boolean,
    public readonly parent_id: string | null,
    public readonly created_at: Date
  ) {}

  static create(
    id: string,
    name: string,
    image_url: string | null = null,
    is_active: boolean = true,
    parent_id: string | null = null,
    created_at: Date = new Date()
  ): MarketplaceCategory {
    return new MarketplaceCategory(
      id,
      name,
      image_url,
      is_active,
      parent_id,
      created_at
    );
  }
}
