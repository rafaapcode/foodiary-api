import { Meal } from '@application/entities/Meal';

export class MealItem {
  static readonly type = 'Meal';
  private readonly keys: MealItem.Keys;

  constructor(private readonly attrs: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK({ accountId: this.attrs.accountId, mealId: this.attrs.id }),
      SK: MealItem.getSK(this.attrs.id),
      GSI1PK: MealItem.getGSI1PK({ accountId: this.attrs.accountId, createdAt: new Date(this.attrs.createdAt) }),
      GSI1SK: MealItem.getGSI1SK(this.attrs.accountId),
    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal) {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(mealItem: MealItem.ItemType) {
    return new Meal({
      accountId: mealItem.accountId,
      attempts: mealItem.attempts,
      foods: mealItem.foods,
      icon: mealItem.icon,
      inputFileKey: mealItem.inputFileKey,
      inputType: mealItem.inputType,
      name: mealItem.name,
      status: mealItem.status,
      createdAt: new Date(mealItem.createdAt),
      id: mealItem.id,
    });
  }

  static getPK({ accountId, mealId }: MealItem.PKParams): MealItem.Keys['PK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getSK(mealId: string): MealItem.Keys['SK'] {
    return `MEAL#${mealId}`;
  }

  static getGSI1PK({
    accountId,
    createdAt,
  }: MealItem.GSI1PKParams): MealItem.Keys['GSI1PK'] {

    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(accountId: string): MealItem.Keys['GSI1SK'] {
    return `MEALS#${accountId}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `ACCOUNT#${string}#MEAL#${string}`;
    SK: `MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GSI1SK: `MEALS#${string}`;
  };

  export type Attributes = {
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    inputType: Meal.InputType;
    id: string;
    createdAt: string;
  };

  export type ItemType = Keys &
    Attributes & {
      type: 'Meal';
    };

  export type GSI1PKParams = {
    accountId: string;
    createdAt: Date;
  };

  export type PKParams = {
    accountId: string;
    mealId: string;
  };
}
