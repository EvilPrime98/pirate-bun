import { ultraCompState, ultraQuery, ultraState, type IUltraCompStateStateful } from "ultra-light.js";
import type { ILink } from "../mainTypes";
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

export function ultraLinks() {
    
    const queryProvider = ultraQuery();  
    
    const [getLinks, setLinks,] = ultraState<ILink[]>([]);   
    
    const [getFilteredLinks, setFilteredLinks, subscribeToFilteredLinks] = ultraState<ILink[]>([]);  
    
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
            })];
        }

    })

    function applyFilters(){
        let results = [...getLinks()];
        if (filters.sortByDate.get()) results = results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        if (filters.sortBySeeders.get()) results = results.sort((a, b) => Number(b.seeders) - Number(a.seeders));
        if (filters.sortBySeedersASC.get()) results = results.sort((a, b) => Number(a.seeders) - Number(b.seeders));
        if (filters.sortByLeechers.get()) results = results.sort((a, b) => Number(b.leechers) - Number(a.leechers));
        if (filters.sortByLeechersASC.get()) results = results.sort((a, b) => Number(a.leechers) - Number(b.leechers));
        setFilteredLinks(results);
    }

    async function fetchComics({
        search,
        pages = 1
    }: {
        search: string,
        pages?: number,
    }) {
        if (!search || search.length < 3) return;
        const response = await queryProvider.fetch(
            `pb-links-${search}-${pages}`,
            () => linksService({ search, pages }),
            5 * 60 * 1000
        );
        if (queryProvider.hasError()) return;
        const { data } = response;
        const { results } = data;
        setLinks(results);
        applyFilters();
    }

    return {
        queryProvider,
        filters,
        cleanup: filters.subscribe(applyFilters),
        getLinks: getFilteredLinks,
        subscribeToLinks: subscribeToFilteredLinks,
        fetchComics,
    }

}
