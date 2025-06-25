import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetMeController extends Controller<'private', GetMeController.Response> {
  protected override async handle({ accountId }: Controller.Request<'private'>): Promise<Controller.Response<GetMeController.Response>> {
    return {
      statusCode: 201,
      body: {
        accountId,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    accountId: string;
  }
}
