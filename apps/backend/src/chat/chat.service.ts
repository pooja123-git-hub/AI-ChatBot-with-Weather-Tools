import { Injectable } from '@nestjs/common';
import { convertToModelMessages, ModelMessage, streamText, UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import express from 'express';
import { ToolsService } from './tools.service';

@Injectable()
export class ChatService {

  constructor(private readonly toolsService: ToolsService) {}

  async chat(messages: UIMessage[], model: string, res: express.Response) {

    const modelMessages: ModelMessage[] = [
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

    return result.pipeUIMessageStreamToResponse(res);
  }

  private getSystemPrompt() {
    return `
You are a helpful AI assistant.

You can answer general questions normally.

You have access to a weather tool called getWeather.

If the user asks about weather in a location, call the tool.

Otherwise answer normally.
`;
  }

}