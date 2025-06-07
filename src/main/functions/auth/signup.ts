import 'reflect-metadata';

import { SignUpController } from '@application/controllers/auth/SignUpController';
import { Registry } from '@kernel/di/registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(SignUpController);

export const handler = lambdaHttpAdapter(controller);
