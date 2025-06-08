import { InvalidCredentials } from '@application/errors/application/InvalidCredentials';
import { NotAuthorizedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SingInUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    password,
  }: SingInUseCase.Input): Promise<SingInUseCase.OutPut> {
    const response = {
      accessToken: '',
      refreshToken: '',
    };

    try {
      const { accessToken, refreshToken } = await this.authGateway.signIn({
        email,
        password,
      });
      response.accessToken = accessToken;
      response.refreshToken = refreshToken;
    } catch (error) {
      if(error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
        throw new InvalidCredentials();
      }

      throw error;
    }

    return response;
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
