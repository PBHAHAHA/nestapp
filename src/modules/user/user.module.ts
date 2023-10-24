import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database/database.module';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'zhuoda',
            signOptions: {
                expiresIn: '7d',
            },
        }),
        TypeOrmModule.forFeature([User]),
        DatabaseModule.forRepository([UserRepository]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
