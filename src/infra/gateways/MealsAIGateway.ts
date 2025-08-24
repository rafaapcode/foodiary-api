/* eslint-disable no-console */
import { Meal } from '@application/entities/Meal';
import { getImagePrompt } from '@infra/ai/prompts/getImagePrompt';
import { Injectable } from '@kernel/decorators/Injectable';
import OpenAI, { toFile } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { downloadFileFromURL } from 'src/utils/downloadFileFromUrl';
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
    const mealFileUrl = this.mealsFileStorageGateway.getFileURL(meal.inputFileKey);
    if(meal.inputType === Meal.InputType.PICTURE){;
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
                  url: mealFileUrl,
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

    const audioFile = await downloadFileFromURL(mealFileUrl);
    const openAiFile = await toFile(audioFile, 'audio.m4a', { type: 'audio/m4a' });

    const res = await this.client.audio.transcriptions.create({
      model: 'whisper-1',
      file: openAiFile,
    });

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
