import { UltraActivity, UltraComponent, ultraState } from "ultra-light.js";
import styles from './app.module.css';
import { ultraLinks } from "./hooks/ultraLinks";
import { LowSeedersModal } from "./components/low-seeders-modal";
import { Loader } from "./components/loader";
import { SearchInput } from "./components/search-input";
import { ResultsTable } from "./components/results-table";
import { ResultsIndicator } from "./components/results-indicator";

export function App() {

    const { 
        getLinks, 
        subscribeToLinks, 
        fetchComics, 
        queryProvider: linksProvider, 
        cleanup: ultraLinksCleanup, 
        filters 
    } = ultraLinks();

    const [,setSearch,] = ultraState<string>('');
    
    const [getPages, setPages] = ultraState<number>(1);
    
    const [getFilter, setFilter, subscribeToFilter] = ultraState<string>('');
    
    const [getPendingMagnet, setPendingMagnet, subscribeToPendingMagnet] = ultraState<string | null>(null);

    const getFilteredLinks = () => {
        const filter = getFilter().toLowerCase().trim();
        return filter
        ? getLinks().filter(link => link.title.toLowerCase().includes(filter))
        : getLinks();
    }

    const handleSearch = (search: string) => {
        fetchComics({ search, pages: getPages() });
    }

    return UltraComponent({
        
        cleanup: [...ultraLinksCleanup],

        component: '<main></main>',

        className: [styles.app!],

        children: [

            `<h1 class="${styles.title}">PBClient</h1>`,

            UltraComponent({                
                component: '<div></div>',                
                className: [styles.searchRow!],
                children: [
                    SearchInput({
                        setSearch,
                        handleSearch 
                    }),                  
                    UltraComponent({
                        component: '<input/>',
                        className: [styles.searchInput!],
                        attributes: {
                            type: 'text',
                            placeholder: 'Filter by title'
                        },
                        eventHandler: {
                            input: (event: Event) => {
                                const input = event.target as HTMLInputElement;
                                setFilter(input.value);
                            }
                        }
                    }),
                    UltraComponent({
                        component: `<select>
                            <option value="1">1 page</option>
                            <option value="2">2 pages</option>
                            <option value="3">3 pages</option>
                            <option value="5">5 pages</option>
                            <option value="10">10 pages</option>
                        </select>`,
                        className: [styles.pagesSelect!],
                        eventHandler: {
                            change: (event: Event) => {
                                const select = event.target as HTMLSelectElement;
                                setPages(Number(select.value));
                            }
                        }
                    })
                ]
            }),

            UltraActivity({
                component: ResultsIndicator({
                    getFilteredLinks,
                    subscribeToLinks,
                    subscribeToFilter
                }),
                mode: {
                    state: () => getLinks().length > 0,
                    subscriber: subscribeToLinks,
                }
            }),

            Loader({
                stateFunction: () => linksProvider.isFetching(),
                subscribers: linksProvider.subscribeToFetching,
            }),

            UltraActivity({
                component: ResultsTable({
                    getFilteredLinks,
                    setPendingMagnet,
                    subscribeToLinks,
                    subscribeToFilter,
                    filters
                }),
                mode: {
                    state: () => !linksProvider.isFetching(),
                    subscriber: linksProvider.subscribeToFetching,
                },
            }),

            LowSeedersModal({
                getPendingMagnet,
                setPendingMagnet,
                subscribeToPendingMagnet,
            })

        ]

    })

}
