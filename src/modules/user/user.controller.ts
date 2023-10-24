import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto, RegisterDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('login')
    login(@Body() user: LoginDto) {
        return this.userService.login(user);
    }

    @Post('register')
    register(@Body() user: RegisterDto) {
        return this.userService.register(user);
    }
}
