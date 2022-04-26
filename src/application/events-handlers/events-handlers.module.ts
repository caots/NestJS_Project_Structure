import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';
import { TagsRepository } from 'src/infrastructure/repositories/tags.repository';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';
import { BlogsEventHandlers } from 'src/application/events-handlers/blogs/_index';
import { CommonService } from 'src/application/core/ultils/common.service';
import { SecurityService } from 'src/application/core/securities/security.service';

@Module({
  imports: [
  TypeOrmModule.forFeature(
  [
    BlogsRepository, 
    EventLogAccessRepository,
    UsersRepository,
    TagsRepository
  ]),
  CqrsModule],
  providers: [
    ...BlogsEventHandlers,
    CommonService,
    SecurityService
  ]
})
export class EventsHandlersModule {
}
