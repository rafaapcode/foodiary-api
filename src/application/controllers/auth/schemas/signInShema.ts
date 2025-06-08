import z from 'zod';

export const signInSchema = z.object({
  password: z.string().min(8, 'Password should be at least 8 charcteres long'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export type SignInBody = z.infer<typeof signInSchema>;
