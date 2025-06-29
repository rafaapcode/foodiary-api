import { Meal } from '@application/entities/Meal';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateMealUseCase{
  constructor(private readonly mealRepo: MealRepository) {}

  async execute({ accountId, file }: CreateMealUseCase.Input): Promise<CreateMealUseCase.OutPut> {
    const meal = new Meal({
      accountId,
      inputFileKey: 'INPUT_FILE_KEY_EXAMPLE',
      status: Meal.Status.UPLOADING,
      inputType: file.inputType,
    });

    await this.mealRepo.create(meal);

    return {
      mealId: meal.id,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    }
  };

  export type OutPut = {
    mealId: string;
  }
}
