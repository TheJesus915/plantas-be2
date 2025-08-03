import { Reading } from '../entities/reading.entity';

export interface ReadingRepository {
  saveReading(reading: Reading): Promise<Reading>;
  findPotById(potId: string): Promise<{
    id: string;
    name?: string;
    device: { id: string; linking_key: string } | null;
    plant: { name: string; image_url?: string | null; mintemp?: number | null | undefined; maxtemp?: number | null | undefined; minhum?: number | null | undefined; maxhum?: number | null | undefined };
    user: { id: string };
    area: { name: string };
  } | null>;
  findDeviceSettingsById(deviceId: string): Promise<{ light_on: boolean; watering_on: boolean } | null>;
  findPotByDeviceId(deviceId: string): Promise<{ id: string } | null>;
}