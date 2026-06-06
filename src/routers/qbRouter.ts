import { Hono } from "hono";
import type { IqbModel } from "../types";

export function qbRouter({
    qbModel
}:{
    qbModel: () => IqbModel
}) {

    const app = new Hono();

    app.get('/status', async (c) => {

        try {

            const missing = [
                'QB_HOST', 
                'QB_USER', 
                'QB_PASS'
            ].filter((k) => !process.env[k]);

            if (missing.length) {
                return c.json({
                    error: true,
                    message: `Missing environment variable(s): ${missing.join(', ')}`,
                    ok: false
                }, 500);
            }

            const client = await qbModel().getCookie();
            const version = await client.getVersion();

            return c.json({
                error: false,
                message: 'qBittorrent healthy',
                ok: true,
                version
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'qBittorrent unhealthy',
                ok: false
            }, 503);

        }

    });

    app.get('/torrents', async (c) => {

        try {

            const client = await qbModel().getCookie();
            const torrents = await client.getTorrents();

            return c.json({
                error: false,
                message: 'Search successful',
                torrents
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'There was an error searching',
                torrents: []
            }, 500);

        }

    });

    app.get('/torrents/:hash', async (c) => {

        try {

            const hash = c.req.param('hash');
            const client = await qbModel().getCookie();
            const torrent = await client.getTorrent(hash);

            if (!torrent) return c.json({
                error: true,
                message: 'Torrent not found',
                torrent: null
            }, 404);

            return c.json({
                error: false,
                message: 'Search successful',
                torrent
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'There was an error searching',
                torrents: []
            }, 500);

        }

    });

    app.delete('/torrents/:hash', async (c) => {

        try {

            const hash = c.req.param('hash');
            const fileRemoval = c.req.query('fileRemoval') === 'true';
            const client = await qbModel().getCookie();
            await client.deleteTorrent(hash, fileRemoval);

            return c.json({
                error: false,
                message: 'Torrent deleted'
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'There was an error deleting the torrent'
            }, 500);

        }

    });

    return app;

}
