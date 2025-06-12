import { Controller } from '@application/contracts/Controller';
import { ForgotPasswordUseCase } from '@application/usecases/auth/ForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { ForgotPasswordBody, forgotPasswordSchema } from './schemas/forgotPasswordSchema';

@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<'public',ForgotPasswordController.Response> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', ForgotPasswordBody>): Promise<Controller.Response<ForgotPasswordController.Response>> {
    const { email } = body;
   await this.forgotPasswordUseCase.execute({ email });

    return {
      statusCode: 204,
    };
  }
}

export namespace ForgotPasswordController {
  export type Response = null
}
