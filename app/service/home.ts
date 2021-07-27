import { Service } from 'egg';

import { stob } from '../utils/common';

export default class HomeService extends Service {
    genSubContent(urls: string[]) {
        return stob(urls.join('\n'));
    }

    async genSSRSubContent() {
        const { ctx } = this;
        const { service } = ctx;
        const urls = await service.ssr.getUrlsFromCache();
        return this.genSubContent(urls);
    }
}