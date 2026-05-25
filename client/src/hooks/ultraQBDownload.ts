import { ultraQuery } from "ultra-light.js";
import { downloadMagnet } from "../services/links";

export function ultraQBDownload() {

    const queryProvider = ultraQuery();

    async function download({
        magnet,
        directory,
    }: {
        magnet: string,
        directory?: string,
    }) {
        const { data } = await queryProvider.fetch(
            `pb-download-${magnet}`,
            () => downloadMagnet({ magnet, ...(directory ? { savePath: directory } : {}) })
        );
        console.log(data);
    }

    return {
        queryProvider,
        download
    }

}
