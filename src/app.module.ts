import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './application/core/configs/orm.config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/application/core/exceptions-filter/http-exception.filter';
import { HttpExceptionAccessRepository } from 'src/infrastructure/repositories/http-exception-access.repository';
import { AllExceptionsFilter } from 'src/application/core/exceptions-filter/all-exceptions.filter';
import { UsersModule } from 'src/api/users/users.module';
import { BlogsModule } from 'src/api/blogs/blogs.module';
import { CommonService } from 'src/application/core/ultils/common.service';
import { NotFoundExceptionFilter } from './application/core/exceptions-filter/not-found.filter';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

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
      })
      
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    CommonService,
  ],
})
export class AppModule {}
