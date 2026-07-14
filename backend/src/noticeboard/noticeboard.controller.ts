import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NoticeboardService } from './noticeboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

class CreateAnnouncementDto {
  title: string;
  content: string;
  pinned: boolean;
}

class CreateCommentDto {
  content: string;
}

@ApiTags('Community Noticeboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('noticeboard')
export class NoticeboardController {
  constructor(private noticeboardService: NoticeboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of community announcements' })
  async getAnnouncements() {
    return this.noticeboardService.getAnnouncements();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Moderator', 'Admin')
  @ApiOperation({ summary: 'Create a community announcement (Moderator / Admin only)' })
  @ApiBody({ type: CreateAnnouncementDto })
  async create(@Request() req: any, @Body() body: CreateAnnouncementDto) {
    const authorName = `${req.user.name} (${req.user.role})`;
    return this.noticeboardService.postAnnouncement(authorName, body);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to announcement' })
  @ApiBody({ type: CreateCommentDto })
  async addComment(@Request() req: any, @Param('id') id: string, @Body() body: CreateCommentDto) {
    return this.noticeboardService.addComment(id, req.user.name, body.content);
  }
}
