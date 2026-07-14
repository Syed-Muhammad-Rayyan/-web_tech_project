import { Module } from '@nestjs/common';
import { NoticeboardService } from './noticeboard.service';
import { NoticeboardController } from './noticeboard.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NoticeboardController],
  providers: [NoticeboardService],
  exports: [NoticeboardService],
})
export class NoticeboardModule {}
