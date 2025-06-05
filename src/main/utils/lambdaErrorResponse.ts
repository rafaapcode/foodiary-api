import { ErrorCode } from '@application/errors/http/ErrorCode';

interface ILambdaErrorResponseParams {
  statusCode: number;
  code: ErrorCode;
  message: any;
}

export function lambdaErrorResponse({
  code,
  message,
  statusCode,
}: ILambdaErrorResponseParams) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: {
        code: code,
        message,
      },
    }),
  };
}
