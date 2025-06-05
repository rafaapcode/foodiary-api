import 'reflect-metadata';

import { HelloController } from '@application/controllers/HelloController';
import { Registry } from '@kernel/di/registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { HelloUseCase } from 'src/usecases/HelloUseCase';

const container = new Registry();
container.register(HelloUseCase);
container.register(HelloController);

const controller = container.resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
