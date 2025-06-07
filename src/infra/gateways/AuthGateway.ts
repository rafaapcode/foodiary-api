import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@kernel/decorators/Injectable';
import { cognitoClient } from '../clients/cognitoClient';

@Injectable()
export class AuthGayeway {
  async signUp({ email, password }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: '',
      Username: email,
      Password: password,
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if(!externalId) {
      throw new Error(`Cannot signup the user: ${email}`);
    }

    return {
      externalId,
    };
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
  }

  export type SignUpResult = {
    externalId: string;
  }
}
