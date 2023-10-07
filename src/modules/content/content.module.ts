import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database/database.module';

import * as controllers from './controllers';
import * as entities from './entities';
import * as repositories from './repositories';
import * as servies from './services';
import { SanitizeService } from './services';
import { PostSubscriber } from './subscribers';

@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(servies), PostSubscriber, SanitizeService],
    exports: [...Object.values(servies), DatabaseModule.forRepository(Object.values(repositories))],
})
export class ContentModule {}
