import { InvalidCredentials } from '@application/errors/application/InvalidCredentials';
import { NotAuthorizedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.OutPut> {
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authGateway.refreshToken({
        refreshToken,
      });
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if(error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
        throw new InvalidCredentials();
      }

      throw error;
    }
  }
}

export namespace RefreshTokenUseCase {
  export type Input = {
    refreshToken: string
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
