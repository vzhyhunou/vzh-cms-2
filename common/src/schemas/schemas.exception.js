export class NotFoundException extends Error {
  constructor() {
    super('Not Found');
  }
}

export class ConflictException extends Error {
  constructor() {
    super('Conflict');
  }
}
