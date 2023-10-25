import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientException extends HttpException {
  constructor(error: unknown) {
    super(
      error,
      ((error as Record<string, unknown>).statusCode as number) ||
        HttpStatus.BAD_REQUEST,
    );
  }
}
