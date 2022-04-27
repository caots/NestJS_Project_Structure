import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'Devzonevn2021@',
  port: 3306,
  database: 'base_nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
};
