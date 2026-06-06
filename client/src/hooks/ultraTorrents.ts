import { ultraQuery, ultraState } from "ultra-light.js";
import { deleteTorrentService, torrentsService } from "../services/torrents";
import type { ITorrent } from "../mainTypes";

export function ultraTorrents() {

    const queryProvider = ultraQuery();

    const [getTorrents, setTorrents, subscribeToTorrents] = ultraState<ITorrent[]>([]);

    let pollingTimer: ReturnType<typeof setTimeout> | null = null;
    let isPolling = false;

    async function fetchTorrents() {
        const { data } = await queryProvider.fetch(
            `qb-torrents-${Date.now()}`,
            torrentsService
        );
        if (!queryProvider.hasError() && data) setTorrents(data);
    }

    async function silentPoll() {
        if (!isPolling) return;
        try {
            const data = await torrentsService();
            setTorrents(data);
        } catch {}
        if (isPolling) {
            pollingTimer = setTimeout(silentPoll, 1000);
        }
    }

    async function startPolling() {
        await fetchTorrents();
        isPolling = true;
        pollingTimer = setTimeout(silentPoll, 1000);
    }

    function stopPolling() {
        isPolling = false;
        if (pollingTimer !== null) {
            clearTimeout(pollingTimer);
            pollingTimer = null;
        }
    }

    async function deleteTorrent(hash: string, deleteFiles: boolean) {
        setTorrents(getTorrents().filter(t => t.hash !== hash));
        await deleteTorrentService(hash, deleteFiles);
    }

    return {
        queryProvider,
        getTorrents,
        subscribeToTorrents,
        fetchTorrents,
        startPolling,
        stopPolling,
        deleteTorrent,
    };

}
