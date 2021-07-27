import { Service } from 'egg';
import cheerio from 'cheerio';

export default class CrawlService extends Service {
    async alvin9999(): Promise<string[]> {
        const { ctx, service } = this;
        const { logger } = ctx;
        const res = await ctx
            .curl('https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7', {
                retry: 2,
            })
            .catch((err) => {
                ctx.logger.error('请求alivin9999失败', err);
                return { data: '' };
            });
        const html = res.data.toString();
        
        if (!html) {
            return [];
        }
        const $ = cheerio.load(html);

        const name2keyMap = {
            '位置': 'remarks',
            '地址': 'server',
            '端口': 'port',
            '密码': 'password',
            '加密方式': 'encryption',
            '协议': 'protocol',
            '混淆': 'obfs',
        };
        const ths = $('table th');

        const keys: string[] = ths.map((_idx, ele) => {
            const name = $(ele).text().trim();
            return name2keyMap[name];
        }).toArray();

        // 文档结构可能变动
        if (!keys.filter(k => k).length) {
            logger.warn('alivin9999文档结构变更，请及时更新', keys);
        }

        const rows = $('tbody tr');
        const ssrUrls = rows.map((_rowIdx, row) => {
            const ssrInfo = {};
            $('td', row).map((idx, ele) => {
                ssrInfo[keys[idx]] = $(ele).text().trim();
            });
            return service.ssr.genSSRUrl(ssrInfo as any);
        }).toArray();
        
        logger.info('[ssr]爬取alivin9999数据', ssrUrls);
        
        
        return ssrUrls;
    }
}