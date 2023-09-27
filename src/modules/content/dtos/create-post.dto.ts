import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@Injectable()
export class CreatePostDto {
    @MaxLength(255, {
        always: true,
        message: '文章的标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题不能为空' })
    @IsOptional({ groups: ['update'] })
    title: string;

    @MinLength(10, {
        always: true,
        message: '文章最少要有10个字',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章内容不能为空' })
    @IsOptional({ groups: ['update'] })
    body: string;

    @MaxLength(255, {
        always: true,
        message: '文章摘要长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    summary?: string;
}
