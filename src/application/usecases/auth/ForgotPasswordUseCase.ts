import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
  }: ForgotPassword.Input): Promise<ForgotPassword.OutPut> {
    await this.authGateway.forgotPassword({ email });
  }
}

export namespace ForgotPassword {
  export type Input = {
    email: string
  };

  export type OutPut = void
}
