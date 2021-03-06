import { Service } from 'egg';

import { base64code } from '../utils/common';

export default class HomeService extends Service {
    genSubContent(urls: string[]) {
        return base64code(urls.join('\n'));
    }

    async genSSRSubContent() {
        const { ctx } = this;
        const { service } = ctx;
        const urls = await service.ssr.getUrlsFromCache();
        return this.genSubContent(urls);
    }
}