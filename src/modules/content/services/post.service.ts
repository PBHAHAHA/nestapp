import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';

import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

import { PostEntity } from '../types';

@Injectable()
export class PostService {
    protected posts: PostEntity[] = [
        { title: '第一篇文章', body: '内容' },
        { title: '第2篇文章', body: '内容2' },
    ].map((item, index) => {
        const id = index;
        return { ...item, id };
    });

    async findAll() {
        return this.posts;
    }

    async findOne(id: number) {
        const post = this.posts.find((item: PostEntity) => item.id === Number(id));
        if (isNil(post)) throw new NotFoundException(`没有id=${id}的文章`);
        return post;
    }

    async create(data: CreatePostDto) {
        const newPost: PostEntity = {
            id: Math.max(...this.posts.map((item) => item.id + 1)),
            ...data,
        };
        this.posts.push(newPost);
        return newPost;
    }

    async update(data: UpdatePostDto) {
        let oriPost = this.posts.find(({ id }) => id === Number(data.id));
        if (isNil(oriPost)) throw new NotFoundException(`没有id=${data.id}的文章`);
        oriPost = { ...oriPost, ...data };
        this.posts = this.posts.map((item) => (item.id === Number(oriPost.id) ? oriPost : item));
        return oriPost;
    }

    async delete(id: number) {
        const toDelete = this.posts.find((item) => item.id === Number(id));
        if (isNil(toDelete)) throw new NotFoundException(`没有id=${id}的文章`);
        this.posts = this.posts.filter((item) => item.id !== Number(id));
        return toDelete;
    }
}
