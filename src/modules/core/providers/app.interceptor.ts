import { ClassSerializerInterceptor, PlainLiteralObject, StreamableFile } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { isArray, isNil, isObject } from 'lodash';

export class AppIntercepter extends ClassSerializerInterceptor {
    serialize(
        response: PlainLiteralObject | Array<PlainLiteralObject>,
        options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
        if ((!isObject(response) && !isArray(response)) || response instanceof StreamableFile) {
            return response;
        }
        // 如果响应数据是数组则遍历每一项进行序列话
        if (isArray(response)) {
            return (response as PlainLiteralObject[]).map((item) => {
                return !isObject(item) ? item : this.transformToPlain(item, options);
            });
        }
        // 如果是分页数据
        if ('meta' in response && 'items' in response) {
            const items = !isNil(response.items) && isArray(response.items) ? response.items : [];
            return {
                ...response,
                items: (items as PlainLiteralObject[]).map((item) => {
                    return !isObject(item) ? item : this.transformToPlain(item, options);
                }),
            };
        }

        return this.transformToPlain(response, options);
    }
}
