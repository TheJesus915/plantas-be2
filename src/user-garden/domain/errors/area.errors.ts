export class AreaNotFoundError extends Error {
  constructor(id: string) {
    super(`Area with ID ${id} not found`);
    this.name = 'AreaNotFoundError';
  }
}

export class AreaNotOwnedError extends Error {
  constructor(id: string) {
    super(`You do not have permission to access this area`);
    this.name = 'AreaNotOwnedError';
  }
}

export class DuplicateAreaNameError extends Error {
  constructor(name: string) {
    super(`Area with name ${name} already exists`);
    this.name = 'DuplicateAreaNameError';
  }
}

export class InvalidAreaStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAreaStateError';
  }
}