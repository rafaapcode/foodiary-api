import { Meal } from '@application/entities/Meal';
import { GetCommand, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { MealItem } from '../items/MealItem';

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommand(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);
    return {
      TableName: this.appConfig.database.dynamodb.mainTable,
      Item: mealItem.toItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommand(meal)));
  }

   async findById({ mealId, accountId }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamodb.mainTable,
      Key: {
        PK: MealItem.getPK({ accountId, mealId }),
        SK: MealItem.getSK(mealId),
      },
    });

    const { Item: mealItem } = await dynamoClient.send(command);

    if(!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemType);
  }
}

export namespace MealRepository {

  export type FindByIdParams = {
    mealId: string;
    accountId: string;
  }

  export type FindByIdOutPut = {
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
