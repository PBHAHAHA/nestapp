// src/modules/content/dtos/comment.dto.ts

import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { PaginateOptions } from '@/modules/database/types';
import { IsDataExist } from '@/modules/core/constraints/data.exist.constraint';
import { CommentEntity, PostEntity } from '../entities';

/**
 * 评论分页查询验证
 */
@DtoValidation({ groups: ['query'] })
export class QueryCommentDto implements PaginateOptions {
    @IsDataExist(PostEntity, {
        message: '文章不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    post?: string;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}

/**
 * 评论树查询
 */
export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['post']) {}

/**
 * 评论添加验证
 */
@DtoValidation({groups: ['create']})
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body: string;

    @IsDataExist(PostEntity, {
        always: true,
        message: '文章不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsDefined({ message: 'ID必须指定' })
    post: string;

    @IsDataExist(CommentEntity, {
        message: '父评论不存在',
    })
    @IsUUID(undefined, { always: true, message: 'ID格式错误' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
}
