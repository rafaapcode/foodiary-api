import { Meal } from '@application/entities/Meal';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetMealById {
  constructor(private readonly mealRepo: MealRepository) {}

  async execute({
    accountId,
    mealId,
  }: GetMealById.Input): Promise<GetMealById.OutPut> {}
}

export namespace GetMealById {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type OutPut = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileKey: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}
