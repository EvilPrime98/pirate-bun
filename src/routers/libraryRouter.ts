import { Hono } from "hono";
import type { IfsModel } from "../types";

export function libraryRouter({ 
    fsModel 
}: { 
    fsModel: () => IfsModel 
}) {

    const app = new Hono();

    app.get('/', async (c) => {

        try {

            const directories = await fsModel().getDirectories();

            return c.json({
                error: false,
                message: 'Library retrieved successfully',
                directories
            }, 200);

        } catch (e) {

            console.log(e);

            return c.json({
                error: true,
                message: 'There was an error reading the library',
                directories: []
            }, 500);

        }

    });

    return app;

}
