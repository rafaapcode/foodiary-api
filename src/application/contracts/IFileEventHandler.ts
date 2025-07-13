export interface IFIleEventHandler {
  handle: (input: IFIleEventHandler.Input) => Promise<void>;
}

export namespace IFIleEventHandler {
  export type Input = {
    fileKey: string;
  }
}
