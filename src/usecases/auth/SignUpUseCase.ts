import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.OutPut> {
    await this.authGateway.signUp(input);

    const { accessToken, refreshToken } = await this.authGateway.signIn(input);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  }
}
