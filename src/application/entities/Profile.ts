
export class Profile {
  readonly accountId: string;

  name: string;
  birthDate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;
  activityLevel: Profile.ActivityLevel;
  goal: Profile.Goal;

  readonly createdAt: Date;

  externalId: string | undefined;

  constructor(attr: Profile.Attributes){
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.goal = attr.goal;
    this.activityLevel = attr.activityLevel;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    createdAt?: Date;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    goal: Profile.Goal;
  }

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHLETE  = 'ATHLETE'
  }

  export enum Goal {
    MANTAIN = 'MANTAIN',
    GAIN = 'GAIN',
    LOSE = 'LOSE',
  }
}
