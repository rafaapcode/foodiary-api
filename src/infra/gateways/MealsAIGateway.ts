/* eslint-disable no-console */
import { Meal } from '@application/entities/Meal';
import { getImagePrompt } from '@infra/ai/prompts/getImagePrompt';
import { Injectable } from '@kernel/decorators/Injectable';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { MealsFileStorageGateway } from './MealsFileStorageGateway';

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    carbohydrates: z.number(),
    fats: z.number(),
    proteins: z.number(),
    calories: z.number(),
  })),
});

@Injectable()
export class MealsAIGateway {
  constructor(private readonly mealsFileStorageGateway: MealsFileStorageGateway) {}

  private readonly client = new OpenAI();

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    if(meal.inputType === Meal.InputType.PICTURE){
      const image = this.mealsFileStorageGateway.getFileURL(meal.inputFileKey);
      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: getImagePrompt(),
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: `Meal date: ${meal.createdAt}`,
              },
            ],
          },
        ],
        response_format: zodResponseFormat(mealSchema, 'meal'),
      });

      const jsonResponse = response.choices[0].message.content;

      if(!jsonResponse) {
        throw new Error(`Failed processing meal "${meal.id}"`);
      }

      const { success, data, error } = mealSchema.safeParse(JSON.parse(jsonResponse));

      if(!success) {
        console.error('Zod error', error);
        console.log('OpenAI response', JSON.stringify(jsonResponse, null, 2));
        throw new Error(`Failed processing meal "${meal.id}"`);
      }

      return data;
    }

    return {
      foods: [],
      icon: '',
      name: '',
    };
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  }
}
