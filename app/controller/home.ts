import { Controller } from 'egg';

export default class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = 'hiya';
    }

    async ssr() {
        const { ctx } = this;
        ctx.body = await ctx.service.home.genSSRSubContent();
    }

    async recrawl() {
        const { ctx, app } = this;
        await app.runSchedule('crawl');
        ctx.body = 'recrawl over';
    }
}
