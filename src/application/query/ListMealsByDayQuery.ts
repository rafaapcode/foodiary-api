import { Meal } from '@application/entities/Meal';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { MealItem } from '@infra/database/dynamo/items/MealItem';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';

@Injectable()
export class ListMealsByDayQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute({
    accountId,
    date,
  }: ListMealsByDayQuery.Input): Promise<ListMealsByDayQuery.OutPut> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamodb.mainTable,
      IndexName: 'GSI1',
      KeyConditionExpression: '#GSI1PK = :GSI1PK',
      ProjectionExpression: '#GSI1PK, #id, #createdAt, #foods, #icon, #name',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#id': 'id',
        '#createdAt': 'createdAt',
        '#foods': 'foods',
        '#icon': 'icon',
        '#name': 'name',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': MealItem.getGSI1PK({ accountId, createdAt: date }),
        ':status': Meal.Status.SUCCESS,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const items = Items as ListMealsByDayQuery.MealItemType[];

    const meals: ListMealsByDayQuery.OutPut['meals'] = items.map((item) => ({
      createdAt: item.createdAt,
      foods: item.foods,
      icon: item.icon,
      id: item.id,
      name: item.name,
    }));

    return {
      meals,
    };
  }
}

export namespace ListMealsByDayQuery {
  export type Input = {
    accountId: string;
    date: Date;
  };

  export type MealItemType = {
    GSI1PK: string;
    id: string;
    createdAt: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type OutPut = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
