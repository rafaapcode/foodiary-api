import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateMealUseCase {
  async execute(input: CreateMealUseCase.Input): Promise<CreateMealUseCase.OutPut> {
    return {
      CreateMealUseCase: input.email,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    email: string;
  }

  export type OutPut = {
    CreateMealUseCase: string;
  }
}
