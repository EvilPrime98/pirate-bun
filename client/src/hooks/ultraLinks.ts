import { ultraCompState, ultraQuery, ultraState, type IUltraCompStateStateful } from "ultra-light.js";
import type { IApiFilters, ILink } from "../mainTypes";
import { linksService } from "../services/links";

export interface IFilters {
    sortByDate: IUltraCompStateStateful<boolean>;
    sortBySeeders: IUltraCompStateStateful<boolean>;
    sortBySeedersASC: IUltraCompStateStateful<boolean>;
    sortByLeechers: IUltraCompStateStateful<boolean>;
    sortByLeechersASC: IUltraCompStateStateful<boolean>;
    subscribe: (fn: () => void) => (() => void)[];
    reset: () => void;
}

const queryProvider = ultraQuery();

export function ultraLinks() {
    
    const [getLinks, setLinks,] = ultraState<ILink[]>([]);
    
    const [getFilteredLinks, setFilteredLinks, subscribeToFilteredLinks] = ultraState<ILink[]>([]);
    
    const [getApiFilters, setApiFilters,] = ultraState<IApiFilters>({});
    
    const [getCurrentSearch, setCurrentSearch,] = ultraState<string>('');
    
    const [getCurrentPages, setCurrentPages,] = ultraState<number>(1);

    const filters: IFilters = ultraCompState({

        sortByDate: false,
        sortBySeeders: false,
        sortBySeedersASC: false,
        sortByLeechers: false,
        sortByLeechersASC: false,

        reset: (state: IFilters) => {
            Object.keys(state).forEach(key => {
                //@ts-ignore
                if (state[key].set) state[key].set(false);
            })
        },

        subscribe: (state: IFilters, fn: () => void) => {
            return [...Object.keys(state).map(key => {
                //@ts-ignore
                if (state[key].subscribe) return state[key].subscribe(fn);
            }).filter(Boolean)];
        }

    })

    function applyClientFilters(){
        let results = [...getLinks()];
        if (filters.sortByDate.get()) results = results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        if (filters.sortBySeeders.get()) results = results.sort((a, b) => Number(b.seeders) - Number(a.seeders));
        if (filters.sortBySeedersASC.get()) results = results.sort((a, b) => Number(a.seeders) - Number(b.seeders));
        if (filters.sortByLeechers.get()) results = results.sort((a, b) => Number(b.leechers) - Number(a.leechers));
        if (filters.sortByLeechersASC.get()) results = results.sort((a, b) => Number(a.leechers) - Number(b.leechers));
        setFilteredLinks(results);
    }

    async function performFetch(search: string, pages: number) {
        const apiFilters = getApiFilters();
        const cacheKey = `pb-links-${search}-${pages}-${JSON.stringify(apiFilters)}`;
        const response = await queryProvider.fetch(
            cacheKey,
            () => linksService({ search, pages, apiFilters }),
            5 * 60 * 1000
        );
        if (queryProvider.hasError()) return;
        const { data } = response;
        const { results } = data;
        setLinks(results);
        applyClientFilters();
    }

    async function fetchComics({
        search,
        pages = 1,
    }: {
        search: string;
        pages?: number;
    }) {
        if (!search || search.length < 3) return;
        setCurrentSearch(search);
        setCurrentPages(pages);
        await performFetch(search, pages);
    }

    async function applyApiFilters(newFilters: IApiFilters) {
        setApiFilters(newFilters);
        const search = getCurrentSearch();
        if (!search || search.length < 3) return;
        await performFetch(search, getCurrentPages());
    }

    return {
        queryProvider,
        filters,
        cleanup: filters.subscribe(applyClientFilters),
        getLinks: getFilteredLinks,
        subscribeToLinks: subscribeToFilteredLinks,
        fetchComics,
        applyApiFilters,
    }

}
