import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);
    router.get('/ssr', controller.home.ssr);
    router.get('/recrawl', controller.home.recrawl);
};
