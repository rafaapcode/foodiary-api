import 'reflect-metadata';

import { RefreshTokenController } from '@application/controllers/auth/RefreshTokenController';
import { Registry } from '@kernel/di/registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(RefreshTokenController);

export const handler = lambdaHttpAdapter(controller);
