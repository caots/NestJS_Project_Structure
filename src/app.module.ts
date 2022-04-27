import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from 'src/api/blogs/blogs.module';
import { UsersModule } from 'src/api/users/users.module';
import { HttpExceptionFilter } from 'src/application/core/exceptions-filter/http-exception.filter';
import { CommonService } from 'src/application/core/ultils/common.service';
import { HttpExceptionAccessRepository } from 'src/infrastructure/repositories/http-exception-access.repository';

import { ormConfig } from './application/core/configs/orm.config';
import { NotFoundExceptionFilter } from './application/core/exceptions-filter/not-found.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([HttpExceptionAccessRepository]),
    UsersModule,
    BlogsModule,
    CqrsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      })
      
    })
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    CommonService,
    ConfigService,
  ],
})
export class AppModule {}
