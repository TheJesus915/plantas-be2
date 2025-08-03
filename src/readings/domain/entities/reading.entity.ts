export class Reading {
  constructor(
    public id: string,
    public potId: string,
    public deviceId: string | null,
    public temperature: number,
    public humidity: number,
    public createdAt: Date,
  ) {}
}