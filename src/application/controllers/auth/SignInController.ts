import { Controller } from '@application/contracts/Controller';
import { SingInUseCase } from '@application/usecases/auth/SignInUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { SignInBody, signInSchema } from './schemas/signInShema';

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<'public',SignInController.Response> {
  constructor(private readonly signInUseCase: SingInUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'public', SignInBody>): Promise<Controller.Response<SignInController.Response>> {
    const { email, password } = body;
    const {
      accessToken,
      refreshToken,
    } = await this.signInUseCase.execute({ email, password });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignInController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  }
}
