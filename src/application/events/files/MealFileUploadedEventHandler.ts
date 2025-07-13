import { IFIleEventHandler } from '@application/contracts/IFileEventHandler';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class MealFileUploadedEventHandler implements IFIleEventHandler {
  async handle(input: IFIleEventHandler.Input) {
    console.log(input);
  }
}
