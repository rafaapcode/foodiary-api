import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
  }: ForgotPassword.Input): Promise<ForgotPassword.OutPut> {
    try {
      await this.authGateway.forgotPassword({ email });
    } catch  {
      // handle error for security
    }
  }
}

export namespace ForgotPassword {
  export type Input = {
    email: string
  };

  export type OutPut = void
}
