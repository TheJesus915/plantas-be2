export class PotNotFoundError extends Error {
  constructor(id: string) {
    super(`Pot with ID ${id} not found`);
    this.name = 'PotNotFoundError';
  }
}

export class PotNotOwnedError extends Error {
  constructor(id: string) {
    super(`Pot with ID ${id} is not owned by the user`);
    this.name = 'PotNotOwnedError';
  }
}

export class InvalidPotStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPotStateError';
  }
}

export class DuplicatePotNameError extends Error {
  constructor(name: string) {
    super(`Pot with name '${name}' already exists`);
    this.name = 'DuplicatePotNameError';
  }
}

export class PlantNotFoundError extends Error {
  constructor(id: string) {
    super(`Plant with ID ${id} not found`);
    this.name = 'PlantNotFoundError';
  }
}

export class AreaNotFoundError extends Error {
  constructor(id: string) {
    super(`Area with ID ${id} not found`);
    this.name = 'AreaNotFoundError';
  }
}