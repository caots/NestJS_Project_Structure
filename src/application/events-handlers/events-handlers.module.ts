import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityService } from 'src/application/core/securities/security.service';
import { BlogsEventHandlers } from 'src/application/events-handlers/blogs/_index';
import { UsersEventHandlers } from 'src/application/events-handlers/users/_index';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';
import { TagsRepository } from 'src/infrastructure/repositories/tags.repository';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { jwtConstants } from '../core/auth/auth.config';
import { UtilsModule } from '../core/ultils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogsRepository,
      EventLogAccessRepository,
      UsersRepository,
      TagsRepository,
    ]),
    UtilsModule,
    JwtModule.register({}),
    CqrsModule,
  ],
  providers: [
    ...BlogsEventHandlers, 
    ...UsersEventHandlers, 
    SecurityService,
  ],
})
export class EventsHandlersModule { }
