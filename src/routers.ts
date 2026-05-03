import { Hono } from "hono";
import type { IpbModel } from "./types";

export function pbRouter({
    pbModel
}:{
    pbModel: () => IpbModel
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

    return app;

}