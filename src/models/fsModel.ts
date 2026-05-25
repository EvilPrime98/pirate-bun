import { readdir } from "fs/promises";
import type { IfsModel, TLibraryEntry } from "../types";
import path from "path";


export function fsModel(): IfsModel {

    const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR;

    async function getDirectories(): Promise<TLibraryEntry[]> {

        if (!DOWNLOAD_DIR) throw new Error("DOWNLOAD_DIR is not set");

        const entries = await readdir(DOWNLOAD_DIR, {
            withFileTypes: true,
            recursive: true
        });

        const directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => {
            const fullPath = path.resolve(entry.parentPath, entry.name);
            return {
                relativePath: path.relative(DOWNLOAD_DIR, fullPath),
                name: entry.name,
            };
        });

        return directories

    }

    return {
        getDirectories
    };

}
