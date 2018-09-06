const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const request = require('./lib/request');
const services = require('./lib/services');

const app = new Koa();
const router = new Router();

router.post('/session/use/', (ctx, next) => {
    const id = services.createSession(ctx.request.body, true);
    ctx.body = { id };
    next();
});

router.post('/session/collect/', (ctx, next) => {
    const id = services.createSession(ctx.request.body, false);
    ctx.body = { id };
    next();
});

router.all('/proxy/:proto/:host/:url*', (ctx, next) => request(ctx.method, ctx.params, ctx.query, ctx.headers).then((req) => {
    console.log('========', req.text);
    ctx.body = req.text;
    const h = req.headers;
    delete h['content-encoding'];
    h['content-length'] = Buffer.byteLength(req.text);
    Object.keys(h).forEach((name) => {
        ctx.set(name, h[name]);
    });
}, (e) => {
    const h = e.response.headers;
    console.error('-------', e.toString(), e.response.req);
    Object.keys(h).forEach((name) => {
        ctx.set(name, h[name]);
    });
    ctx.body = e.response.text;
}).then(next));

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
