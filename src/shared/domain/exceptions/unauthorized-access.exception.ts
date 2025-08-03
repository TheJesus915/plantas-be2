import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedAccessException extends HttpException {
  constructor(message: string = 'User without permission to perform this action') {
    super(message, HttpStatus.FORBIDDEN);
  }
}