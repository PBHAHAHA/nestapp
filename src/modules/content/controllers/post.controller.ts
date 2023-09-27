import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';

import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    async index() {
        return this.postService.findAll();
    }

    @Get(':id')
    async show(@Param('id', new ParseIntPipe()) id: number) {
        return this.postService.findOne(id);
    }

    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                // whitelist: true, //会剔除非验证的参数
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: true },
                groups: ['create'],
            }),
        )
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }

    // 更新数据
    @Patch()
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdatePostDto,
    ) {
        return this.postService.update(data);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.postService.delete(id);
    }
}
