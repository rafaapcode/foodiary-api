import { IFIleEventHandler } from '@application/contracts/IFileEventHandler';
import { S3Handler } from 'aws-lambda';

export function lambdaS3Adapter(
  eventHandler: IFIleEventHandler,
): S3Handler {
  return async (event) => {
    const responses = await Promise.allSettled(
      event.Records.map((record) =>
        eventHandler.handle({
          fileKey: record.s3.object.key,
        }),
      ),
    );

    const failedEvents = responses.filter((res) => res.status === 'rejected');

    for (const event of failedEvents) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(event.reason, null, 2));
    }
  };
}
