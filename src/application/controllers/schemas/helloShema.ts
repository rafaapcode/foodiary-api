import z from 'zod';

export const helloSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export type HelloBody = z.infer<typeof helloSchema>;
