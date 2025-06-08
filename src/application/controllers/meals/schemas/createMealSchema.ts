import z from 'zod';

export const createMealSchema = z.object({
  password: z.string().min(8, 'Password should be at least 8 charcteres long'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export type CreateMealSchemaBody = z.infer<typeof createMealSchema>;
