import { Meal } from '@application/entities/Meal';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsAIGateway } from '@infra/gateways/MealsAIGateway';
import { Injectable } from '@kernel/decorators/Injectable';

const MAX_ATTEMPTS = 2;

@Injectable()
export class ProcessMealUseCase {
  constructor(
    private readonly mealRepo: MealRepository,
    private readonly mealsAIGw: MealsAIGateway,

  ) {}

  async execute({
    accountId,
    mealId,
  }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.OutPut> {
    const meal = await this.mealRepo.findById({
      mealId,
      accountId,
    });

    if (!meal) {
      throw new ResourceNotFound(`Meal "${mealId}" not found`);
    }

    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is still uploading`);
    }

    if(meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being processing`);
    }

    if (meal.status === Meal.Status.SUCCESS) {
      return;
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;
      await this.mealRepo.save(meal);

      // processa com ia
      await this.mealsAIGw.processMeal(meal);

      meal.status = Meal.Status.SUCCESS;
      meal.name = 'Teste';
      meal.icon = '🥗';
      meal.foods = [
        {
          calories: 100,
          carbohydrates: 200,
          fats: 300,
          name: 'pao',
          proteins: 200,
          quantity: '2 unidades',
        },
      ];

      await this.mealRepo.save(meal);
    } catch (error) {
      meal.status = meal.attempts >= MAX_ATTEMPTS ? Meal.Status.FAILED :Meal.Status.QUEUED;
      await this.mealRepo.save(meal);

      throw error;
    }

  }
}

export namespace ProcessMealUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type OutPut = void;
}
