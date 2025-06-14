import z from 'zod';

export const confirmForgotPasswordSchema = z.object({
  email: z.string().min(1, '"email" is required').email('Invalid email'),
  confirmationCode: z.string().min(1, '"confimationCode" is required'),
  password: z.string().min(8, '"password" is required and must be at least 8 characters'),
});

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>;
