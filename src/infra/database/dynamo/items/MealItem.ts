import { Account } from '@application/entities/Account';

export class MealItem {
  static readonly type = 'Account';
  private readonly keys: MealItem.Keys;

  constructor(private readonly attrs: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK(this.attrs.id),
      SK: MealItem.getSK(this.attrs.id),
      GSI1PK: MealItem.getGSI1PK(this.attrs.email),
      GSI1SK: MealItem.getGSI1SK(this.attrs.email),
    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static fromEntity(account: Account) {
    return new MealItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(accountItem: MealItem.ItemType) {
    return new Account({
      id: accountItem.id,
      cratedAt: new Date(accountItem.createdAt),
      email: accountItem.email,
      externalId: accountItem.externalId,
    });
  }

  static getPK(accountId: string): MealItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): MealItem.Keys['SK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): MealItem.Keys['GSI1PK'] {
    return `ACCOUNT#${email}`;
  }

  static getGSI1SK(email: string): MealItem.Keys['GSI1SK'] {
    return `ACCOUNT#${email}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  };

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Account'
  };
}
