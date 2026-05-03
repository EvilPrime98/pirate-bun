import { Hono } from "hono";
import type { IpbModel, IqbModel } from "./types";

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
                numOfPages: pages
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
            const magnet = body.magnet;
            
            if (!magnet) {
                return c.json({
                    error: true,
                    message: 'No magnet provided',
                    entry: null
                }, 422);
            }

            const entry = (await qbModel().getCookie()).addMagnet(magnet as string);
    
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