import { z } from 'zod';

export const schema = z.object({
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_CLIENT_SECRET: z.string().min(1),
});

export const env = schema.parse(process.env);
