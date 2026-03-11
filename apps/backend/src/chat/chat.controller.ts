import { Controller, Post,Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UIMessage } from 'ai';
import express from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
        @Post()
        chat(
            @Body() body: { messages: UIMessage[]; model: string }
           , @Res() res : express.Response ,

        )
        {
this.chatService.chat(body.messages, body.model,res)
        }
    }


