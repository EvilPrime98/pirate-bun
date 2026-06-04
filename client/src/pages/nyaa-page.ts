import { UltraActivity, UltraComponent, ultraState, UltraLink } from "ultra-light.js";
import styles from '../app.module.css';
import { ultraNyaa } from "../hooks/ultraNyaa";
import { ultraLibrary } from "../hooks/ultraLibrary";
import { LowSeedersModal } from "../components/low-seeders-modal";
import { DownloadDirModal } from "../components/download-dir-modal";
import { Loader } from "../components/loader";
import { SearchInput } from "../components/search-input";
import { NyaaTable } from "../components/nyaa-table";

export function NyaaPage() {

    const {
        getLinks,
        subscribeToLinks,
        fetchNyaa,
        queryProvider: nyaaProvider,
    } = ultraNyaa();

    const {
        getDirectories,
        subscribeToDirectories,
        fetchDirectories,
    } = ultraLibrary();

    const [, setSearch] = ultraState<string>('');

    const [getFilter, setFilter, subscribeToFilter] = ultraState<string>('');

    const [getPendingMagnet, setPendingMagnet, subscribeToPendingMagnet] = ultraState<string | null>(null);

    const [getPendingDownload, setPendingDownload, subscribeToPendingDownload] = ultraState<string | null>(null);

    const getFilteredLinks = () => {
        const filter = getFilter().toLowerCase().trim();
        return filter
            ? getLinks().filter(link => link.name.toLowerCase().includes(filter))
            : getLinks();
    };

    const handleSearch = (query: string) => {
        fetchNyaa({ query });
    };

    const onDownload = (magnet: string) => {
        fetchDirectories();
        setPendingDownload(magnet);
    };

    return UltraComponent({

        component: '<main></main>',

        className: [styles.app!],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.homeHeader!],

                children: [

                    UltraComponent({
                        component: '<h1>Nyaa</h1>',
                        className: [styles.title!],
                        styles: {
                            viewTransitionName: 'nyaa-to-nyaa'
                        }
                    }),

                    UltraLink({
                        href: '/',
                        children: [
                            UltraComponent({
                                component: '<span>PbClient</span>',
                                styles: {
                                    viewTransitionName: 'pbclient-to-home'
                                }
                            })
                        ],
                        viewTransition: true
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
                            placeholder: 'Filter by name'
                        },
                        eventHandler: {
                            input: (event: Event) => {
                                const input = event.target as HTMLInputElement;
                                setFilter(input.value);
                            }
                        }
                    }),

                ]
            }),

            UltraActivity({
                component: UltraComponent({
                    component: '<p></p>',
                    className: [styles.resultsIndicator!],
                    trigger: [{
                        subscriber: [subscribeToLinks, subscribeToFilter],
                        triggerFunction: ($p: HTMLElement) => {
                            $p.textContent = `${getFilteredLinks().length} results`;
                        }
                    }]
                }),
                mode: {
                    state: () => getLinks().length > 0,
                    subscriber: subscribeToLinks,
                }
            }),

            Loader({
                stateFunction: () => nyaaProvider.isFetching(),
                subscribers: nyaaProvider.subscribeToFetching,
            }),

            UltraActivity({
                component: NyaaTable({
                    getFilteredLinks,
                    setPendingMagnet,
                    onDownload,
                    subscribeToLinks,
                    subscribeToFilter,
                }),
                mode: {
                    state: () => !nyaaProvider.isFetching(),
                    subscriber: nyaaProvider.subscribeToFetching,
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

    });

}
