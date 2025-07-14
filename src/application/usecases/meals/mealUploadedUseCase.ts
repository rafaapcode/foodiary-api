import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorageGateway } from '@infra/gateways/MealsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class MealUploadedUseCase {
  constructor(
    private readonly mealRepo: MealRepository,
    private readonly mealsFileStorage: MealsFileStorageGateway,
  ) {}

  async execute({ fileKey }: MealUploadedUseCase.Input): Promise<MealUploadedUseCase.OutPut> {
    const { accountId, mealId } = await this.mealsFileStorage.getFileMetadata({ fileKey });

    const meal = await this.mealRepo.findById({
      accountId,
      mealId,
    });

    if(!meal) {
      throw new ResourceNotFound('Meal not found.');
    };

    console.log(meal);
  }
}

export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string;
  };

  export type OutPut = void;
}
