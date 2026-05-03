import { Hono } from "hono";
import { cors } from 'hono/cors'
import { pbModel, qbModel } from './src/models.ts';
import { pbRouter } from './src/routers.ts';
import { serveStatic } from "hono/bun";
import { NOT_FOUND } from "./src/data.ts";

function createApp() {

    const app = new Hono();

    app.use(cors());

    app.route('/api', pbRouter({ pbModel, qbModel }));

    if (process.env.HEADLESS !== 'true') {
        app.use('/*', serveStatic({ root: './client/dist' }));
        app.get('/*', serveStatic({ path: 'index.html', root: './client/dist' }));
    }else{
        app.get('/*', (c) => c.html(NOT_FOUND, 404));
    }

    const server = Bun.serve({
        fetch: app.fetch,
        idleTimeout: 0
    });

    console.log(`Server running at ${server.url}api`);

}

createApp();