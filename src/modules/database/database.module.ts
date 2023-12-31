// src/modules/database/database.module.ts

import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from './constants';
import { DataExistConstraint } from '../core/constraints/data.exist.constraint';
import { UniqueTreeConstraint } from '../core/constraints/tree.unique.constraint';

@Module({})
export class DatabaseModule {
    static forRoot(configRegister: () => TypeOrmModuleOptions): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            imports: [TypeOrmModule.forRoot(configRegister())],
            providers: [DataExistConstraint, UniqueTreeConstraint],
        };
    }

    static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];
        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);
            if (!entity) {
                continue;
            }
            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): InstanceType<typeof Repo> => {
                    const base = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: DatabaseModule,
            providers,
        };
    }
}
