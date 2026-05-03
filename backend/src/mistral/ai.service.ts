import { Injectable } from '@nestjs/common';
import { Mistral } from '@mistralai/mistralai';

@Injectable()
export class MistralApiConfig {
  private readonly client: Mistral;

  constructor() {
    this.client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }

  async generateResponse(prompt: string) {
    const response = await this.client.chat.complete({
      model: 'mistral-medium-latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? '';
  }
}
