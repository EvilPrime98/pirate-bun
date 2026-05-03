import { Hono } from "hono";
import { cors } from 'hono/cors'
import { pbModel } from './src/models.ts';
import { pbRouter } from './src/routers.ts';
import { serveStatic } from "hono/bun";

function createApp() {

    const app = new Hono();

    app.use(cors());

    app.route('/api', pbRouter({ pbModel }));

    app.use('/*', serveStatic({ root: './client/dist' }));
    app.get('/*', serveStatic({ path: 'index.html', root: './client/dist' }));

    const server = Bun.serve({
        fetch: app.fetch,
        idleTimeout: 0
    });

    console.log(`Server running at ${server.url}`);

}

createApp();