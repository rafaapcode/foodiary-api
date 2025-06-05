import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class HelloUseCase {
  async execute(input: HelloUseCase.Input): Promise<HelloUseCase.OutPut> {
    return {
      helloUseCase: input.email,
    };
  }
}

export namespace HelloUseCase {
  export type Input = {
    email: string;
  }

  export type OutPut = {

    helloUseCase: string;
  }
}
