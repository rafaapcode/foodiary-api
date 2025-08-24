import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { Registry } from '@kernel/di/registry';
import { Constructor } from '@shared/types/constructor';
import { SQSHandler } from 'aws-lambda';

export function lambdaSQSAdapter(
  consumerImpl: Constructor<IQueueConsumer<any>>,
): SQSHandler {
  return async (event) => {
    const consumer = Registry.getInstance().resolve(consumerImpl);
    await Promise.all(
      event.Records.map(async (record) => {
        const msg = JSON.parse(record.body);
        await consumer.process(msg);
      }),
    );
  };
}
