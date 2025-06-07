import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  public override statusCode = 500;
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'InternalServerError';
    this.message = message ?? 'Internal Server Error';
    this.code = code ?? ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
