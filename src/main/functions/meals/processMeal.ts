import 'reflect-metadata';

import { MealsQueueConsumer } from '@application/queues/MealsQueuesConsumer';
import { Registry } from '@kernel/di/registry';
import { lambdaSQSAdapter } from '@main/adapters/lambdasSQSAdapter';

const consumer = Registry.getInstance().resolve(MealsQueueConsumer);

export const handler = lambdaSQSAdapter(consumer);
