import { Meal } from './../../application/entities/Meal';
/* eslint-disable no-console */
import { getImagePrompt } from '@infra/ai/prompts/getImagePrompt';
import { getTextPrompt } from '@infra/ai/prompts/getTextPrompt';
import { Injectable } from '@kernel/decorators/Injectable';
import OpenAI, { toFile } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionContentPart } from 'openai/resources/index';
import { downloadFileFromURL } from 'src/utils/downloadFileFromUrl';
import { z } from 'zod';
import { MealsFileStorageGateway } from './MealsFileStorageGateway';

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      carbohydrates: z.number(),
      fats: z.number(),
      proteins: z.number(),
      calories: z.number(),
    }),
  ),
});

@Injectable()
export class MealsAIGateway {
  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  private readonly client = new OpenAI();

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    const mealFileUrl = this.mealsFileStorageGateway.getFileURL(
      meal.inputFileKey,
    );

    if (meal.inputType === Meal.InputType.PICTURE) {
      return await this.callAI({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessagesParts: [
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
      });
    }

    const transcription  = await this.transcribe(mealFileUrl);

    return await this.callAI({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessagesParts: `Meal date: ${meal.createdAt}\n\nMeal: ${transcription}`,
    });
  }

  private async callAI({
    systemPrompt,
    userMessagesParts,
    mealId,
  }: MealsAIGateway.CallAIParams): Promise<MealsAIGateway.ProcessMealResult> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessagesParts,
        },
      ],
      response_format: zodResponseFormat(mealSchema, 'meal'),
    });

    const jsonResponse = response.choices[0].message.content;

    if (!jsonResponse) {
      console.error('OpenAI reponse:', JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal "${mealId}"`);
    }

    const { success, data, error } = mealSchema.safeParse(
      JSON.parse(jsonResponse),
    );

    if (!success) {
      console.error('Zod error', error.issues);
      console.log('OpenAI response', JSON.stringify(jsonResponse, null, 2));
      throw new Error(`Failed processing meal "${mealId}"`);
    }

    return data;
  }

  private async transcribe(mealFileUrl: string): Promise<string> {
    const audioFile = await downloadFileFromURL(mealFileUrl);
    const openAiFile = await toFile(audioFile, 'audio.m4a', {
      type: 'audio/m4a',
    });

    const { text } = await this.client.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: openAiFile,
    });

    return text;
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type CallAIParams = {
    mealId: string;
    systemPrompt: string;
    userMessagesParts: ChatCompletionContentPart[] | string;
  };
}
