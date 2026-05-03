import { ultraQuery, ultraState } from "ultra-light.js";
import type { ILink } from "../mainTypes";
import { linksService } from "../services/links";

const queryProvider = ultraQuery();

export function ultraLinks() {

    const [getLinks, setLinks, subscribeToLinks] = ultraState<ILink[]>([]);

    async function fetchComics({
        search,
        pages = 1
    }: {
        search: string,
        pages?: number,
    }) {
        if (!search || search.length < 3) return;
        const { data } = await queryProvider.fetch(
            `pb-links-${search}-${pages}`,
            () => linksService({ search, pages }),
            5 * 60 * 1000
        );
        if (queryProvider.hasError()) return;
        const { results } = data;
        setLinks(results);
    }

    return {
        queryProvider,
        getLinks,
        subscribeToLinks,
        fetchComics
    }

}
