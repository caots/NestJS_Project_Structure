import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'Devzonevn2021@',
  port: 12020,
  database: 'base-nestjs',
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false
}