import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class Saga {
  private compensations: (() => Promise<void>)[] = [];

  addCompensation(fn: () => Promise<void>) {
    this.compensations.unshift(fn);
  }

  async run<TResult>(fn: () => Promise<TResult>){
    try {
      return await fn();
    } catch (error) {
      await this.compensate();

      throw error;
    }
  }

  async compensate(){
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch {}
    }
  }

}
