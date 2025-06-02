import { IHttpRequest } from '../contracts/HttpRequest';
import { IHttpResponse } from '../contracts/Httpresponse';

export class HelloController {
  async handle(request: IHttpRequest): Promise<IHttpResponse<unknown>> {
    return {
      statusCode: 200,
      body: {
        deubom: true,
        request,
      },
    };
  }
}
