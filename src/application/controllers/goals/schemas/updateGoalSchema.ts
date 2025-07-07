import z from 'zod';

export const updateGoalSchema = z.object({
  calories: z.number().min(0, '"calories" is required'),
  proteins: z.number().min(0, '"proteins" is required'),
  carbohydrates: z.number().min(0, '"carbohydrates" is required'),
  fats: z.number().min(0, '"fats" is required'),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
