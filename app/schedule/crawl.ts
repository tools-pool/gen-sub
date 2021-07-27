import { Subscription } from 'egg';

export default class CrawlSubscription extends Subscription {
    static get schedule() {
        return {
            interval: '12h',
            type: 'worker',
            immediate: true,
        };
    }
    
    async subscribe() {
        const { ctx } = this;
        const { service, logger } = ctx;

        logger.info('[定时任务]爬取数据开始');
        const tasks = [
            service.ssr.crawlAndSave(),
        ];

        await Promise.all(tasks);

        logger.info('[定时任务]爬取数据结束');
    }
}