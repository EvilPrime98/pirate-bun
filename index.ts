import { Hono } from "hono";
import { cors } from 'hono/cors'
import { pbModel } from './src/models/pbModel.ts';
import { qbModel } from './src/models/qbModel.ts';
import { fsModel } from './src/models/fsModel.ts';
import { pbRouter } from './src/routers/pbRouter.ts';
import { qbRouter } from './src/routers/qbRouter.ts';
import { libraryRouter } from './src/routers/libraryRouter.ts';
import { serveStatic } from "hono/bun";
import { NOT_FOUND } from "./src/data.ts";

function createApp() {

    const app = new Hono();

    app.use(cors());

    app.route('/api', pbRouter({ pbModel, qbModel }));
    
    app.route('/library', libraryRouter({ fsModel }));

    app.route('/qb', qbRouter({ qbModel }));

    if (process.env.HEADLESS !== 'true') {
        app.use('/*', serveStatic({ root: './client/dist' }));
        app.get('/*', serveStatic({ path: 'index.html', root: './client/dist' }));
    }else{
        app.get('/*', (c) => c.html(NOT_FOUND, 404));
    }

    const server = Bun.serve({
        port: process.env.PORT || 3000,
        fetch: app.fetch,
        idleTimeout: 0
    });

    console.log(`Server running at ${server.url}api`);

}

createApp();