const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const services = require('./lib/services');
const config = require('./lib/config');

const app = new Koa();
const router = new Router();

router.post('/session/use/', (ctx, next) => {
    ctx.body = services.createSession(ctx.request.body, true);
    next();
});

router.post('/session/collect/', (ctx, next) => {
    ctx.body = services.createSession(ctx.request.body, false);
    next();
});

router.all(/^\/proxy\/(http|https)\/([\w.]+)(\/?.*)$/, (ctx, next) => {
    const params = {
        proto: ctx.params[0],
        host: ctx.params[1],
        url: ctx.params[2],
    };

    return services.getResponse(ctx.method, params, ctx.query, ctx.headers)
        .then((req) => {
            const h = req.headers;
            delete h['content-encoding']; // data already decoded
            h['content-length'] = Buffer.byteLength(req.body);
            Object.keys(h).forEach((name) => {
                ctx.set(name, h[name]);
            });
            ctx.body = req.body;
            next();
        });
});

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.getPort());
