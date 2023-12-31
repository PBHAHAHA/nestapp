import { DataSource, EventSubscriber } from 'typeorm';

import { PostBodyType } from '../constants';

import { PostEntity } from '../entities/post.entity';

import { PostRepository } from '../repositories';
import { SanitizeService } from '../services';

@EventSubscriber()
export class PostSubscriber {
    constructor(
        protected dataSource: DataSource,
        protected santizeService: SanitizeService,
        protected postRepository: PostRepository,
    ) {}

    listenTo() {
        return PostEntity;
    }

    afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML) {
            entity.body = this.santizeService.sanitize(entity.body);
        }
    }
}
