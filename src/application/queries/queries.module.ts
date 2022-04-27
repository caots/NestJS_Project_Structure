import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';
import { TagsRepository } from 'src/infrastructure/repositories/tags.repository';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';
import { BlogQueryHandlers } from 'src/application/queries/blogs/_index';
import { CommonService } from 'src/application/core/ultils/common.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogsRepository,
      EventLogAccessRepository,
      TagsRepository,
    ]),
    CqrsModule,
  ],
  providers: [...BlogQueryHandlers, CommonService],
})
export class QueriesModule {}
