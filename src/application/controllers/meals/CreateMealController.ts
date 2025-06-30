import { Controller } from '@application/contracts/Controller';
import { Meal } from '@application/entities/Meal';
import { CreateMealUseCase } from '@application/usecases/meals/createMealUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/schema';
import { CreateMealBody, createMealSchema } from './schemas/createMealSchema';

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<'private', CreateMealController.Response> {
  constructor(private readonly creatMealUseCase: CreateMealUseCase) {
    super();
  }

  protected override async handle({ accountId, body }: Controller.Request<'private', CreateMealBody>): Promise<Controller.Response<CreateMealController.Response>> {
    const { file } = body;
    const inputType = file.type === 'audio/m4a' ? Meal.InputType.AUDIO :Meal.InputType.PICTURE;

    const { mealId, uploadSignature } = await this.creatMealUseCase.execute({
      accountId,
      file: {
        size: file.size,
        inputType,
      },
    });

    return {
      statusCode: 201,
      body: {
        mealId,
        uploadSignature,
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
    uploadSignature: string;
  }
}
