import KSUID from 'ksuid';

export class Meal {
  readonly id: string;
  readonly accountId: string;

  status: Meal.Status;

  attempts: number;
  inputType: Meal.InputType;
  inputFileKey: string;

  name: string;
  icon: string;
  foods: Meal.Food[];

  readonly createdAt: Date;

  externalId: string | undefined;

  constructor(attr: Meal.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.status = attr.status;
    this.attempts = attr.attempts;
    this.inputType = attr.inputType;
    this.inputFileKey = attr.inputFileKey;
    this.name = attr.name;
    this.icon = attr.name;
    this.foods = attr.foods;
    this.accountId = attr.accountId;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type Attributes = {
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    inputType: Meal.InputType;
    id?: string;
    createdAt?: Date;
  };

  export enum Status {
    PENDING = 'PENDING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }

  export enum InputType {
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',
  }

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };
}
