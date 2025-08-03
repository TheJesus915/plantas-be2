export class UserGeneralEntity {
  id: string;
  name: string;
  lastname: string;
  email: string;
  status_account: string;
  created_at: Date;
  pots?: PotGeneralEntity[];
}

export class PotGeneralEntity {
  id: string;
  name: string;
  image: string | null;
  created_at: Date;
  catalog_plant?: { id: string; name: string };
  device?: DeviceGeneralEntity;
}

export class DeviceGeneralEntity {
  id: string;
  name: string;
  status: string;
  registered_at?: Date;
  linked_at?: Date | null;
  light_on?: boolean;
  watering_on?: boolean;
}
