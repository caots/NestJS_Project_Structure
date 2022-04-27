import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/application/core/auth/auth.module';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';
import { TagsRepository } from 'src/infrastructure/repositories/tags.repository';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';
import { BlogsCommandHandlers } from 'src/application/commands/blogs/_index';
import { UsersCommandHandlers } from 'src/application/commands/users/_index';
import { CommonService } from 'src/application/core/ultils/common.service';
import { SecurityService } from 'src/application/core/securities/security.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogsRepository,
      EventLogAccessRepository,
      UsersRepository,
      TagsRepository,
    ]),
    CqrsModule,
    AuthModule,
  ],
  providers: [
    ...BlogsCommandHandlers,
    ...UsersCommandHandlers,
    CommonService,
    SecurityService,
  ],
})
export class CommandsModule {}
