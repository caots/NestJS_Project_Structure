import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsCommandHandlers } from 'src/application/commands/blogs/_index';
import { UsersCommandHandlers } from 'src/application/commands/users/_index';
import { AuthModule } from 'src/application/core/auth/auth.module';
import { SecurityService } from 'src/application/core/securities/security.service';
import { CommonService } from 'src/application/core/ultils/common.service';
import { EmailService } from 'src/application/core/ultils/email.service';
import { FilesService } from 'src/application/core/ultils/Files.service';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';
import { TagsRepository } from 'src/infrastructure/repositories/tags.repository';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';

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
    FilesService,
    EmailService,
    SecurityService,
    ConfigService,
  ],
})
export class CommandsModule {}
