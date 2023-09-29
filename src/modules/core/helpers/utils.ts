import deepmerge from 'deepmerge';
import { isNil } from 'lodash';

export function toBoolean(value?: string | boolean): boolean {
    if (isNil(value)) return false;
    if (typeof value === 'boolean') return value;
    try {
        return JSON.parse(value.toLowerCase());
    } catch (error) {
        return value as unknown as boolean;
    }
}

// 请求验证中转义null
export function toNull(value?: string | null): string | null | undefined {
    return value === 'null' ? null : value;
}

export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]));
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};
