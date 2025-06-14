import { InvalidCredentials } from '@application/errors/application/InvalidCredentials';
import { InvalidRefreshToken } from '@application/errors/application/InvalidRefreshToken';
import {
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  RefreshTokenReuseException,
  SignUpCommand,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { createHmac } from 'node:crypto';
import { cognitoClient } from '../clients/cognitoClient';

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async signUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'custom:internalId', Value: internalId },
      ],
      SecretHash: this.getSecretHash(email),
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot signup the user: ${email}`);
    }

    return {
      externalId,
    };
  }

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    try {
      const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.appConfig.auth.cognito.client.id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (
      !AuthenticationResult?.RefreshToken ||
      !AuthenticationResult.AccessToken
    ) {
      throw new Error(`Cannot authenticate user: ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
    } catch (error) {
         if(error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
          throw new InvalidCredentials();
        }

        throw error;
    }
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      RefreshToken: refreshToken,
      ClientSecret: this.appConfig.auth.cognito.client.secret,
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

     if (
      !AuthenticationResult?.RefreshToken ||
      !AuthenticationResult.AccessToken
    ) {
      throw new Error('Cannot refresh your token');
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
    } catch (error) {
      if(error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
        throw new InvalidCredentials();
      }

      if(error instanceof RefreshTokenReuseException) {
        throw new InvalidRefreshToken();
      }

      throw error;
    }
  }

  async forgotPassword({ email }: AuthGateway.ForgotPassword): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });
    await cognitoClient.send(command);
  }

  async confirmForgotPassword({ email, password, confirmationCode }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      Password: password,
      ConfirmationCode: confirmationCode,
      SecretHash: this.getSecretHash(email),
    });
    await cognitoClient.send(command);
  }

  private getSecretHash(email: string): string {
    const { id, secret } = this.appConfig.auth.cognito.client;
    return createHmac('SHA256', secret).update(`${email}${id}`).digest('base64');
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenParams = {
    refreshToken: string;
  };

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPassword = {
    email: string;
  };

   export type ConfirmForgotPasswordParams = {
    email: string;
    confirmationCode: string;
    password: string;
  };
}
