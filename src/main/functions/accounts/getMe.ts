import 'reflect-metadata';

import { GetMeController } from '@application/controllers/accounts/GetMeController';
import { Registry } from '@kernel/di/registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetMeController);

export const handler = lambdaHttpAdapter(controller);
