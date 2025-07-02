import z from 'zod';

export const listMealsByDaySchema = z.object({

  date: z.string().min(1, '"birthDate" is required').date('Invalid date format').transform((date) => new Date(date)),
});

