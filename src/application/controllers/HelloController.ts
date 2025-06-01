import { IHttpRequest } from '../contracts/HttpRequest';

export class HelloController {
  async handle(request: IHttpRequest) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        request,
      }),
    };
  }
}
