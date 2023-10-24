import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    username: string;

    @MinLength(6, { message: '密码长度至少为6位' })
    password: string;
}

export class RegisterDto {
    @IsNotEmpty()
    username: string;

    @MinLength(6, { message: '密码长度至少为6位' })
    password: string;
}
