import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { CommandsModule } from 'src/application/commands/commands.module';
import { LoggerMiddleware } from 'src/application/core/middlewares/logger.middleware';
import { EventsHandlersModule } from 'src/application/events-handlers/events-handlers.module';
import { QueriesModule } from 'src/application/queries/queries.module';
import { EventLogAccessRepository } from 'src/infrastructure/repositories/event-log-access.repository';

import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventLogAccessRepository]),
    CacheModule.register({
      // ttl: 5, //the amount of time that a response is cached before deleting it is 5 seconds
      // max: 100 //the maximum number of elements in the cache
      imports: [ConfigModule],
      inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          ttl: 120
        }),
    }),
    QueriesModule,
    CommandsModule,
    EventsHandlersModule,
    CqrsModule,
  ],
  controllers: [BlogsController],
})
export class BlogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(BlogsController);
  }
}
