export enum LightType {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class LightingSchedule {
  id: string;
  lightingGroupId: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  lightType: LightType;
  lightColor: string;
}
