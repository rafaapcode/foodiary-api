import { z } from 'zod';
import { Controller } from '../contracts/Controller';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export class HelloController extends Controller<unknown> {
  protected override schema = schema;

  protected override async handle(request: Controller.Request<{hello: true}>): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
