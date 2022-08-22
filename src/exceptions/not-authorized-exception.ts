import { HttpException } from 'exceptions/http-exception';

export class NotAuthorizedException extends HttpException {
  constructor(message: string) {
    super(message, 401)
  }
}
