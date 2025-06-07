import { Controller } from '@application/contracts/Controller';
import { SignUpBody, signUpSchema } from '@application/controllers/auth/schemas/signupShema';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { SignUpUseCase } from 'src/usecases/auth/SignUpUseCase';

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<SignUpBody>): Promise<Controller.Response<SignUpController.Response>> {
    const { account } = body;
    const {
      accessToken,
      refreshToken,
    } = await this.signUpUseCase.execute(account);

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  }
}
