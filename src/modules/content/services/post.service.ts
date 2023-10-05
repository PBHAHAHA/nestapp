import { Injectable } from '@nestjs/common';
import { isFunction, isNil, omit } from 'lodash';

// import { QueryHook } from 'typeorm';

import { EntityNotFoundError, IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { paginate } from '@/modules/database/helpers';
import { PaginateOptions, QueryHook } from '@/modules/database/types';

import { PostOrderType } from '../constants';
import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories';

@Injectable()
export class PostService {
    // protected posts: PostEntity[] = [
    //     { title: '第一篇文章', body: '内容' },
    //     { title: '第2篇文章', body: '内容2' },
    // ].map((item, index) => {
    //     const id = index;
    //     return { ...item, id };
    // });

    constructor(protected repository: PostRepository) {}

    async paginate(options: PaginateOptions, callback?: QueryHook<PostEntity>) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    protected async buildListQuery(
        qb: SelectQueryBuilder<PostEntity>,
        options: Record<string, any>,
        callback?: QueryHook<PostEntity>,
    ) {
        const { orderBy, isPublished } = options;
        let newQb = qb;
        if (typeof isPublished === 'boolean') {
            newQb = isPublished
                ? newQb.where({
                      publishedAt: Not(IsNull()),
                  })
                : newQb.where({
                      publishedAt: IsNull,
                  });
        }
        newQb = this.queryOrderBy(newQb, orderBy);
        if (callback) return callback(newQb);
        return newQb;
    }

    protected queryOrderBy(qb: SelectQueryBuilder<PostEntity>, orderBy?: PostOrderType) {
        switch (orderBy) {
            case PostOrderType.CREATED:
                return qb.orderBy('post.createdAt', 'DESC');
            case PostOrderType.UPDATED:
                return qb.orderBy('post.updatedAt', 'DESC');
            case PostOrderType.PUBLISHED:
                return qb.orderBy('post.publishedAt', 'DESC');
            case PostOrderType.CUSTOM:
                return qb.orderBy('customOrder', 'DESC');
            default:
                return qb
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC');
        }
    }

    async detail(id: string, callback?: QueryHook<PostEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`post.id = :id`, { id });
        qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(PostEntity, `The post ${id} not exists!`);
        return item;
    }

    async create(data: Record<string, any>) {
        const item = await this.repository.save(data);

        return this.detail(item.id);
    }

    async update(data: Record<string, any>) {
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }

    async delete(id: string) {
        const item = await this.repository.findOneByOrFail({ id });
        return this.repository.remove(item);
    }
}
