import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SignUpUseCase {
  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.OutPut> {
    console.log(input);
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
