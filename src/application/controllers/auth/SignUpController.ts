import { Controller } from '@application/contracts/Controller';
import { SignUpBody, signUpSchema } from '@application/controllers/auth/schemas/signupShema';
import { SignUpUseCase } from '@application/usecases/auth/SignUpUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<'public', SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', SignUpBody>): Promise<Controller.Response<SignUpController.Response>> {
    const { account, profile } = body;
    const {
      accessToken,
      refreshToken,
    } = await this.signUpUseCase.execute({
      account, profileInfo: profile,
    });

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
