export class HttpException extends Error {
  constructor(message: string = 'Internal error occured', readonly httpCode: number = 500) {
    super(message);
  }
}
