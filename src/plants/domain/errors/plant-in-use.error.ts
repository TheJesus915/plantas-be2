import { BadRequestException } from '@nestjs/common';

export class PlantInUseException extends BadRequestException {
  constructor(id: string) {
    super(`Plant with ID ${id} cannot be deleted because it's being used in one or more user pots`);
  }
}
