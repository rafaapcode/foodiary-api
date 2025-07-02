import { Meal } from '@application/entities/Meal';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorageGateway } from '@infra/gateways/MealsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepo: MealRepository,
    private readonly mealsFileStorage: MealsFileStorageGateway,
  ) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.OutPut> {
    const inputFileKey = MealsFileStorageGateway.generateInputFileKey({
      accountId,
      inputType: file.inputType,
    });

    const meal = new Meal({
      accountId,
      inputFileKey,
      status: Meal.Status.UPLOADING,
      inputType: file.inputType,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepo.create(meal),
      this.mealsFileStorage.createPOST({
        file: {
          key: inputFileKey,
          size: file.size,
          inputType: file.inputType,
        },
        mealId: meal.id,
      }),
    ]);

    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    };
  };

  export type OutPut = {
    mealId: string;
    uploadSignature: string;
  };
}
