import { BadRequest } from '@application/errors/http/BadRequest';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    confirmationCode,
    password,
  }: ConfirmForgotPasswordUseCase.Input): Promise<ConfirmForgotPasswordUseCase.OutPut> {
    try {
      await this.authGateway.confirmForgotPassword({ email, confirmationCode, password });
    } catch  {
      throw new BadRequest('Failed, Try again');
    }
  }
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    email: string
    confirmationCode: string;
    password: string;
  };

  export type OutPut = void
}
