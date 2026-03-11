import { Injectable } from '@nestjs/common';
import { convertToModelMessages, ModelMessage, streamText, UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import express from 'express';
import { ToolsService } from './tools.service';

@Injectable()
export class ChatService {

  constructor(private readonly toolsService: ToolsService) {}

  async chat(messages: UIMessage[], model: string, res: express.Response) {

    const modelMessages: ModelMessage[] =  [
      {
        role: "system",
        content: this.getSystemPrompt()
      },
      ...(await convertToModelMessages(messages))
    ];

    const result = streamText({
      model: google(model),
      messages: modelMessages,
      tools: this.toolsService.getAllTools(),
    });

    console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    console.log(messages);

    return result.pipeUIMessageStreamToResponse(res);
  }

  private getSystemPrompt() {
    return 'You are a generative AI assistant. You can use tools to get information about the weather. Always use the tool when the user asks about the weather.';
  }

}