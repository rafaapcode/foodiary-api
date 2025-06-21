import { Goal } from '@application/entities/Goal';
import { AccountItem } from './AccountItem';

export class GoalItem {
  private readonly type = 'Goal';
  private readonly keys: GoalItem.Keys;

  constructor(private readonly attrs: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attrs.accountId),
      SK: GoalItem.getSK(this.attrs.accountId),
    };
  }

  toItem(): GoalItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(goalItem: GoalItem.ItemType) {
    return new Goal({
      accountId: goalItem.accountId,
      createdAt: new Date(goalItem.createdAt),
      calories: goalItem.calories,
      proteins: goalItem.proteins,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
    });
  }

  static getPK(accountId: string): GoalItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): GoalItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type Keys = {
    PK: AccountItem.Keys['PK'];
    SK: `ACCOUNT#${string}#GOAL`;
  };

  export type Attributes = {
    accountId: string;
    createdAt: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Goal'
  };
}
