import { AuthGayeway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGayeway) {}

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.OutPut> {
    const { externalId } = await this.authGateway.signUp(input);

    // Salvar no DB externalId

    return {
      accessToken: '',
      refreshToken: '',
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
