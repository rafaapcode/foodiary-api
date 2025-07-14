import { IFIleEventHandler } from '@application/contracts/IFileEventHandler';
import { MealUploadedUseCase } from '@application/usecases/meals/mealUploadedUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class MealFileUploadedEventHandler implements IFIleEventHandler {
  constructor(private readonly mealUploadedUseCase: MealUploadedUseCase){}

  async handle({ fileKey }: IFIleEventHandler.Input) {
    await this.mealUploadedUseCase.execute({ fileKey });
  }
}
