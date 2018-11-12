const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
// const cors = require('@koa/cors');

const services = require('./lib/services');
const config = require('./lib/config');

const app = new Koa();
const router = new Router();

router.post('/session/use/', (ctx, next) => services.createSession(ctx.request.body, true).then((body) => {
    ctx.body = body;
}).catch((err) => {
    ctx.body = err;
}).then(next));

router.post('/session/collect/', (ctx, next) => services.createSession(ctx.request.body, false).then((body) => {
    ctx.body = body;
}).catch((err) => {
    ctx.body = err;
}).then(next));

function setAllow(ctx) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
    ctx.set('Access-Control-Allow-Credentials', 'true');
}

router.all(/^\/proxy\/(http|https)\/([\w.-]+)(\/?.*)$/, (ctx, next) => {
    const params = {
        proto: ctx.params[0],
        host: ctx.params[1],
        url: ctx.params[2],
    };
    if (ctx.method === 'OPTIONS') {
        setAllow(ctx);
        next();
        return null;
    }

    return services.getResponse(ctx.method, params, ctx.query, ctx.headers, ctx.request.rawBody)
        .then((req) => {
            const h = req.headers;
            delete h['content-encoding']; // data already decoded
            h['content-length'] = Buffer.byteLength(req.body);
            Object.keys(h).forEach((name) => {
                ctx.set(name, h[name]);
            });
            ctx.body = req.body;
            setAllow(ctx);
            next();
        });
});

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.getPort());
