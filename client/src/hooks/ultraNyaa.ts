import { ultraQuery, ultraState } from "ultra-light.js";
import type { INyaaLink } from "../mainTypes";
import { linksService as nyaaService } from "../services/nyaa";

const queryProvider = ultraQuery();

export function ultraNyaa() {

    const [getLinks, setLinks, subscribeToLinks] = ultraState<INyaaLink[]>([]);

    async function fetchNyaa({ query }: { query: string }) {
        if (!query || query.length < 3) return;
        const cacheKey = `nyaa-${query}`;
        const response = await queryProvider.fetch(
            cacheKey,
            () => nyaaService({ query }),
            5 * 60 * 1000
        );
        if (queryProvider.hasError()) return;
        const { data } = response;
        setLinks(data.results);
    }

    return {
        queryProvider,
        getLinks,
        subscribeToLinks,
        fetchNyaa,
    };
}
