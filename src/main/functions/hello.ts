import 'reflect-metadata';

import { HelloController } from '@application/controllers/HelloController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { HelloUseCase } from 'src/usecases/HelloUseCase';

const controller = new HelloController(new HelloUseCase());

export const handler = lambdaHttpAdapter(controller);
