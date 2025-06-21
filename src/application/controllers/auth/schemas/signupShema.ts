import { Profile } from '@application/entities/Profile';
import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    password: z.string().min(8, '"password" should be at least 8 characteres long'),
    email: z.string().min(1, '"email" is required').email('Invalid email'),
  }),
  profile: z.object({
    name: z.string().min(1, '"name" is required'),
    birthDate: z.string().min(1, '"birthDate" is required').date('Invalid date format').transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender),
    height: z.number().min(0, '"height" must be a positive number'),
    weight: z.number().min(0, '"height" must be a positive number'),
    activityLevel: z.nativeEnum(Profile.ActivityLevel),
    goal: z.nativeEnum(Profile.Goal).optional(),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
