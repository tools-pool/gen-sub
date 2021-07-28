import { encode } from 'urlsafe-base64';

// ! caveat
// 订阅地址的生成过程需要删除为不的=
export function base64code(str: string) {
    return encode(Buffer.from(str, 'utf8'));
}