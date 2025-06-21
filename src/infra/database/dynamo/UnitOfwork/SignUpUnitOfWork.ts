import { Account } from '@application/entities/Account';
import { Goal } from '@application/entities/Goal';
import { Profile } from '@application/entities/Profile';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from '../repositories/AccountRepository';
import { GoalRepository } from '../repositories/GoalRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { UnitOfWork } from './UnitOfWork';

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly goalRepository: GoalRepository,
    private readonly accountRepository: AccountRepository,
  ) {
    super();
  }

  async run({ account, goal, profile }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.accountRepository.getPutCommand(account));
    this.addPut(this.goalRepository.getPutCommand(goal));
    this.addPut(this.profileRepository.getPutCommand(profile));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
    goal: Goal;
    profile: Profile;
  };
}
