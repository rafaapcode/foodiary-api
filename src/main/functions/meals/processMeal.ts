import 'reflect-metadata';

import { MealsQueueConsumer } from '@application/queues/MealsQueuesConsumer';
import { lambdaSQSAdapter } from '@main/adapters/lambdasSQSAdapter';

export const handler = lambdaSQSAdapter(MealsQueueConsumer);
