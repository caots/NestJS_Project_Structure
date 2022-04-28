import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';

import { CommonService } from './common.service';
import { EmailService } from './email.service';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [CommonService, EmailService, FilesService, ConfigService],
  exports: [CommonService, EmailService, FilesService],
})
export class UtilsModule { }
