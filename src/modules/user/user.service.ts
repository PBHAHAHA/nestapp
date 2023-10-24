import * as crypto from 'crypto';

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { LoginDto, RegisterDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

function md5(str: string) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

@Injectable()
export class UserService {
    private logger = new Logger();

    constructor(
        protected repository: UserRepository,
        public jwtService: JwtService,
    ) {}

    @Inject()
    async login(user: LoginDto) {
        const foundUser = await this.repository.findOneBy({
            username: user.username,
        });

        if (!foundUser) {
            throw new HttpException('用户不存在', 200);
        }
        if (foundUser.password !== md5(user.password)) {
            throw new HttpException('密码错误', 200);
        }
        const token = await this.jwtService.signAsync({
            user: {
                id: foundUser.id,
                username: foundUser.username,
            },
        });
        if (token) {
            return {
                token,
                message: '登录成功',
            };
        }

        return '登录失败';
    }

    async register(user: RegisterDto) {
        const founduser = await this.repository.findOneBy({
            username: user.username,
        });
        if (founduser) {
            throw new HttpException('用户已存在', 200);
        }

        const newUser = new User();
        newUser.username = user.username;
        newUser.password = md5(user.password);
        try {
            await this.repository.save(newUser);
            return '注册成功';
        } catch (error) {
            this.logger.error(error, UserService);
            return '注册失败';
        }
    }
}
