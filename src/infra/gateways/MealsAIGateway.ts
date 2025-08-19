import { Meal } from '@application/entities/Meal';
import { Injectable } from '@kernel/decorators/Injectable';
import OpenAI from 'openai';

@Injectable()
export class MealsAIGateway {
  private readonly client = new OpenAI();

  async processMeal(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    if(meal.inputType === Meal.InputType.PICTURE){
      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: 'Olá , tudo bem ?',
          },
        ],
      });
      console.log(response);
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
