import { Profile } from '@application/entities/Profile';
import z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, '"name" is required'),
  birthDate: z
    .string()
    .min(1, '"birthDate" is required')
    .date('Invalid date format')
    .transform((date) => new Date(date)),
  gender: z.nativeEnum(Profile.Gender),
  height: z.number().min(0, '"height" must be a positive number'),
  weight: z.number().min(0, '"height" must be a positive number'),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
