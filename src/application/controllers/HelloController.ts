import { IController } from '../contracts/Controller';

export class HelloController implements IController<unknown> {
  async handle(request: IController.Request<{hello: true}>): Promise<IController.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        deubom: true,
        request,
      },
    };
  }
}
