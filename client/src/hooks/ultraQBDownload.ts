import { ultraQuery } from "ultra-light.js";
import { downloadMagnet } from "../services/links";

export function ultraQBDownload() {

    const queryProvider = ultraQuery();

    async function download({
        magnet
    }: {
        magnet: string,
    }) {
        const { data } = await queryProvider.fetch(
            `pb-download-${magnet}`,
            () => downloadMagnet({ magnet })
        );
        console.log(data);
    }

    return {
        queryProvider,
        download
    }

}