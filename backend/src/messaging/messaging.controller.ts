import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class SendMessageDto {
  recipientId: string;
  content: string;
}

@ApiTags('Real-Time Chat & Messaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('messages')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post()
  @ApiOperation({ summary: 'Send direct message to a neighbour' })
  @ApiBody({ type: SendMessageDto })
  async sendMessage(@Request() req: any, @Body() body: SendMessageDto) {
    return this.messagingService.sendMessage(req.user.id, body);
  }

  @Get('partners')
  @ApiOperation({ summary: 'Get list of active conversation partners' })
  async getPartners(@Request() req: any) {
    return this.messagingService.getChatPartners(req.user.id);
  }

  @Get('thread/:partnerId')
  @ApiOperation({ summary: 'Get chat conversation thread with a partner' })
  async getThread(@Request() req: any, @Param('partnerId') partnerId: string) {
    return this.messagingService.getThread(req.user.id, partnerId);
  }
}
