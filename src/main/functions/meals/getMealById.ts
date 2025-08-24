import 'reflect-metadata';

import { GetMealByIdController } from '@application/controllers/meals/getMealByIdController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(GetMealByIdController);
