import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SingInUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    password,
  }: SingInUseCase.Input): Promise<SingInUseCase.OutPut> {
     const { accessToken, refreshToken } = await this.authGateway.signIn({
        email,
        password,
      });
      return {
        accessToken,
        refreshToken,
      };
  }
}

export namespace SingInUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
