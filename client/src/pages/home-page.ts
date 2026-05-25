import { UltraActivity, UltraComponent, ultraState, UltraLink } from "ultra-light.js";
import styles from '../app.module.css';
import { ultraLinks } from "../hooks/ultraLinks";
import { ultraLibrary } from "../hooks/ultraLibrary";
import { LowSeedersModal } from "../components/low-seeders-modal";
import { DownloadDirModal } from "../components/download-dir-modal";
import { Loader } from "../components/loader";
import { SearchInput } from "../components/search-input";
import { ResultsTable } from "../components/results-table";
import { ResultsIndicator } from "../components/results-indicator";
import { FiltersPanel } from "../components/filters-panel";

export function HomePage() {

    const {
        getLinks,
        subscribeToLinks,
        fetchComics,
        queryProvider: linksProvider,
        cleanup: ultraLinksCleanup,
        filters,
        applyApiFilters,
    } = ultraLinks();

    const {
        getDirectories,
        subscribeToDirectories,
        fetchDirectories,
    } = ultraLibrary();

    const [, setSearch,] = ultraState<string>('');

    const [getPages, setPages] = ultraState<number>(1);

    const [getFilter, setFilter, subscribeToFilter] = ultraState<string>('');

    const [getPendingMagnet, setPendingMagnet, subscribeToPendingMagnet] = ultraState<string | null>(null);

    const [getPendingDownload, setPendingDownload, subscribeToPendingDownload] = ultraState<string | null>(null);

    const getFilteredLinks = () => {
        const filter = getFilter().toLowerCase().trim();
        return filter
            ? getLinks().filter(link => link.title.toLowerCase().includes(filter))
            : getLinks();
    }

    const handleSearch = (search: string) => {
        fetchComics({ search, pages: getPages() });
    }

    const onDownload = (magnet: string) => {
        fetchDirectories();
        setPendingDownload(magnet);
    }

    return UltraComponent({

        cleanup: [...ultraLinksCleanup],

        component: '<main></main>',

        className: [styles.app!],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.homeHeader!],

                children: [

                    UltraComponent({
                        component: '<h1>PbClient</h1>',
                        className: [styles.title!],
                        styles: {
                            viewTransitionName: 'pbclient-to-home'
                        }
                    }),

                    UltraLink({
                        href: '/torrents',
                        children: [
                            UltraComponent({
                                component: '<span>Torrents</span>',
                                styles: {
                                    viewTransitionName: 'torrents-to-torrents'
                                }
                            })
                        ],
                        viewTransition: true
                    }),

                ]

            }),

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

            FiltersPanel({
                onApply: applyApiFilters
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
                    onDownload,
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
            }),

            DownloadDirModal({
                getPendingMagnet: getPendingDownload,
                setPendingMagnet: setPendingDownload,
                subscribeToPendingMagnet: subscribeToPendingDownload,
                getDirectories,
                subscribeToDirectories,
            }),

        ]

    })

}
