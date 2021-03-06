import { Service } from 'egg';
import { getJsonData } from '@pokemonon/knife';

import { base64code } from '../utils/common';
import { Keys } from '../utils/redis';

enum SSRProtocol {
    'origin' = 'origin',
    'verify_deflate' = 'verify_deflate',
    'verify_sha1' = 'verify_sha1',
    'auth_simple' = 'auth_simple',
    'auth_sha1' = 'auth_sha1',
    'auth_sha1_v2' = 'auth_sha1_v2',
    'auth_sha1_v4' = 'auth_sha1_v4',
    'auth_aes128_md5' = 'auth_aes128_md5',
    'auth_aes128_sha1' = 'auth_aes128_sha1'
}

enum SSREncryption {
    'table' = 'table',
    'rc4' = 'rc4',
    'rc4-md5' = 'rc4-md5',
    'bf-cfb' = 'bf-cfb',
    'salsa20' = 'salsa20',
    'chacha20' = 'chacha20'
}
enum SSRObfs {
    'plain' = 'plain',
    'http_simple' = 'http_simple',
    'http_post' = 'http_post',
    'random_head' = 'random_head',
    'tls1.2_ticket_auth' = 'tls1.2_ticket_auth'
}


interface SSROpts {
    server: string;
    port: number;
    password: string;
    encryption: SSREncryption;
    protocol?: SSRProtocol;
    protoparam?: string;
    obfs?: SSRObfs;
    obfsparam?: string;
    remarks?: string;
    group?: string;
}
export default class SSRService extends Service {
    // crawl all ssr url
    async crawl() {
        const { ctx } = this;
        const { service } = ctx;
        const alvin9999List = await service.crawl.alvin9999();

        return [
            ...alvin9999List,
        ];
    }

    //  crawl urls and save them
    async crawlAndSave() {
        const { app } = this;
        const urls = await this.crawl();
        if (!urls.length) return app.redis.get(Keys.SSRURLS);
        return app.redis.set(Keys.SSRURLS, JSON.stringify(urls));
    }

    // get ssr urls from cache
    async getUrlsFromCache() {
        const { app } = this;
        const urls = await app.redis.get(Keys.SSRURLS);
        return getJsonData(urls, []) as string[];
    }

    genSSRUrl(opts: SSROpts) {
        // https://github.com/shadowsocksrr/shadowsocks-rss/wiki/SSR-QRcode-scheme
        // ssr://base64(host:port:protocol:method:obfs:base64pass/?obfsparam=base64param&protoparam=base64param&remarks=base64remarks&group=base64group&udpport=0&uot=0)
        const { ctx } = this;
        const {
            server,
            port,
            password,
            encryption,
            protocol = SSRProtocol.origin,
            obfs = SSRObfs.plain,
        } = opts;

        const originalUrl = `${server}:${port}:${protocol}:${encryption}:${obfs}:${base64code(password).replace(/=+$/, '')}/?` +
            ['protoparam', 'obfsparam', 'remarks', 'group'].map(k => opts[k] && `${k}=${base64code(opts[k])}`).filter(i => i).join('&');
        ctx.logger.info(`[ssr]???????????????${originalUrl}`);
        const ssrUrl = `ssr://${base64code(originalUrl)}`;
        return ssrUrl;
    }
}
