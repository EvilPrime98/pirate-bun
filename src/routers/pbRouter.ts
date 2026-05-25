import { Hono } from "hono";
import path from "path";
import type { IpbModel, IqbModel } from "../types";

const QB_SAVE_DIR = process.env.QB_SAVE_DIR;

function normalizeMediaPath(p: string) {
    return p
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '');
}

export function pbRouter({
    pbModel,
    qbModel
}:{
    pbModel: () => IpbModel,
    qbModel: () => IqbModel
}) {

    const app = new Hono();

    app.get('/', async (c) => {

        try {

            const searchTerm = c.req.query('search');
            const pages = Number(c.req.query('pages')) || 3;

            if (!searchTerm) {
                return c.json({
                    error: true,
                    message: 'No search term provided',
                    results: []
                }, 422);
            }

            const results = await pbModel().get({ 
                searchTerm: searchTerm,
                numOfPages: pages,
                request: c.req
            });

            return c.json({
                error: false,
                message: 'Search successful',
                results
            }, 200);

        } catch (e) {

            return c.json({
                error: true,
                message: 'There was an error searching',
                results: []
            }, 500);

        }

    });

    app.post('/download', async (c) => {

        try {

            const body = await c.req.json();
            
            const magnet = body.magnet as string;
            
            const rawPath: string | undefined = body.savePath
            ? normalizeMediaPath(body.savePath)
            : undefined;

            const savePath = rawPath && QB_SAVE_DIR
            ? path.posix.join(QB_SAVE_DIR, rawPath)
            : undefined;

            if (!magnet) {
                return c.json({
                    error: true,
                    message: 'No magnet provided',
                    entry: null
                }, 422);
            }
            
            const entry = (await qbModel().getCookie())
            .addMagnet(magnet, savePath);
    
            return c.json({
                error: false,
                message: 'Download successful',
                entry
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'There was an error downloading',
                entry: null
            }, 500);

        }

    });

    return app;

}