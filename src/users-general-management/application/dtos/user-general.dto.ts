export class UserGeneralListDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  status_account: string;
  created_at: Date;
}

export class UserGeneralDetailDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  status_account: string;
  created_at: Date;
  pots: PotGeneralDto[];
}

export class PotGeneralDto {
  id: string;
  name: string;
  created_at: Date;
  catalog_plant: CatalogPlantDto;
  device?: DeviceGeneralDto;
}

export class CatalogPlantDto {
  id: string;
  name: string;
}

export class DeviceGeneralDto {
  id: string;
  linked_at?: Date | null;
}
