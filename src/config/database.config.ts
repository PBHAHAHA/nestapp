// src/config/database.config.ts
/**
 * 数据库配置
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export const sqliteDatabase = (): TypeOrmModuleOptions => ({
//     // 以下为mysql配置
//     // charset: 'utf8mb4',
//     // logging: ['error'],
//     // type: 'mysql',
//     // host: '127.0.0.1',
//     // port: 3306,
//     // username: 'root',
//     // password: '12345678',
//     // database: '3r',
//     // 以下为sqlite配置
//     type: 'better-sqlite3',
//     database: resolve(__dirname, '../../database.db'),
//     synchronize: true,
//     autoLoadEntities: true,
// });
export const mysqlDatabase = (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: '3R',
    synchronize: false,
    logging: true,
    autoLoadEntities: true,
    poolSize: 10,
    connectorPackage: 'mysql2',
});
