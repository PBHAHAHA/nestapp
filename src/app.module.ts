import { Module } from '@nestjs/common';

import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlDatabase } from './config';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { AppPipe } from './modules/core/providers';
import { AppFilter } from './modules/core/providers/app.filter';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ContentModule,
        CoreModule.forRoot(),
        DatabaseModule.forRoot(mysqlDatabase),
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // JwtService,
        {
            provide: APP_PIPE,
            useValue: new AppPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
    ],
})
export class AppModule {}
