import { HttpException } from 'exceptions/http-exception';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, 400)
  }
}
