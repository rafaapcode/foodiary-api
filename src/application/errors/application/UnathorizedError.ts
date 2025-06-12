import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './ApplicationError';

export class Unauthorized extends ApplicationError {
  public override statusCode = 401;
  public override code: ErrorCode;

  constructor() {
    super();

    this.name = 'Unathorized';
    this.message = 'Invalid Credentials';
    this.code = ErrorCode.INVALID_CREDENTIALS;
  }
}
