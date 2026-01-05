import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) { }

    @Post('message')
    @ApiOperation({ summary: 'Get response from AI Agent' })
    async getMessage(@Body('message') message: string) {
        const response = await this.chatbotService.getResponse(message);
        return { response };
    }
}
