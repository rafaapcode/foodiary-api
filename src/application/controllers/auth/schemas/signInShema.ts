import z from 'zod';

export const signInSchema = z.object({
  password: z.string().min(8, '"password" should be at least 8 charcteres long'),
  email: z.string().min(1, '"email" is required').email('Invalid email'),
});

export type SignInBody = z.infer<typeof signInSchema>;
