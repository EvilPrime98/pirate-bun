import { UltraActivity, UltraComponent, ultraState, UltraLink } from "ultra-light.js";
import styles from '../app.module.css';
import { ultraNyaa } from "../hooks/ultraNyaa";
import { ultraLibrary } from "../hooks/ultraLibrary";
import { LowSeedersModal } from "../components/low-seeders-modal/low-seeders-modal";
import { DownloadDirModal } from "../components/download-dir-modal/download-dir-modal";
import { Loader } from "../components/loader/loader";
import { SearchInput } from "../components/search-input";
import { NyaaTable } from "../components/nyaa-table/nyaa-table";

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

    const [getQuery, setQuery] = ultraState<string>('');

    const [getNyaaFilter, setNyaaFilter] = ultraState<string>('no-filter');

    const [getNyaaCategory, setNyaaCategory] = ultraState<string>('all');

    const [getPendingMagnet, setPendingMagnet, subscribeToPendingMagnet] = ultraState<string | null>(null);

    const [getPendingDownload, setPendingDownload, subscribeToPendingDownload] = ultraState<string | null>(null);

    const handleSearch = (query: string) => {
        setQuery(query);
        fetchNyaa({ query, filter: getNyaaFilter(), category: getNyaaCategory() });
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

                    UltraLink({
                        href: '/',
                        children: [
                            UltraComponent({
                                component: '<span>PirateBay</span>',
                                styles: {
                                    viewTransitionName: 'pbclient-to-home'
                                }
                            })
                        ],
                        viewTransition: true
                    }),

                    UltraComponent({
                        component: '<h1>Nyaa</h1>',
                        className: [styles.title!],
                        styles: {
                            viewTransitionName: 'nyaa-to-nyaa'
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
                        setSearch: setQuery,
                        handleSearch
                    }),

                    UltraComponent({
                        component: `<select>
                            <option value="no-filter">No filter</option>
                            <option value="no-remakes">No remakes</option>
                            <option value="trusted-only">Trusted only</option>
                        </select>`,
                        className: [styles.pagesSelect!],
                        eventHandler: {
                            change: (e: Event) => {
                                const value = (e.target as HTMLSelectElement).value;
                                setNyaaFilter(value);
                                const q = getQuery();
                                if (q) fetchNyaa({ query: q, filter: value, category: getNyaaCategory() });
                            }
                        }
                    }),

                    UltraComponent({
                        component: `<select>
                            <option value="all">All categories</option>
                            <optgroup label="Anime">
                                <option value="anime">Anime</option>
                                <option value="animeAmv">Anime - AMV</option>
                                <option value="animeEnglish">Anime - English</option>
                                <option value="animeNonEnglish">Anime - Non-English</option>
                                <option value="animeRaw">Anime - Raw</option>
                            </optgroup>
                            <optgroup label="Audio">
                                <option value="audio">Audio</option>
                                <option value="audioLossless">Audio - Lossless</option>
                                <option value="audioLossy">Audio - Lossy</option>
                            </optgroup>
                            <optgroup label="Literature">
                                <option value="literature">Literature</option>
                                <option value="literatureEnglish">Literature - English</option>
                                <option value="literatureNonEnglish">Literature - Non-English</option>
                                <option value="literatureRaw">Literature - Raw</option>
                            </optgroup>
                            <optgroup label="Live Action">
                                <option value="liveAction">Live Action</option>
                                <option value="liveActionEnglish">Live Action - English</option>
                                <option value="liveActionIdol">Live Action - Idol/PV</option>
                                <option value="liveActionNonEnglish">Live Action - Non-English</option>
                                <option value="liveActionRaw">Live Action - Raw</option>
                            </optgroup>
                            <optgroup label="Pictures">
                                <option value="pictures">Pictures</option>
                                <option value="picturesGraphics">Pictures - Graphics</option>
                                <option value="picturesPhotos">Pictures - Photos</option>
                            </optgroup>
                            <optgroup label="Software">
                                <option value="software">Software</option>
                                <option value="softwareApps">Software - Apps</option>
                                <option value="softwareGames">Software - Games</option>
                            </optgroup>
                        </select>`,
                        className: [styles.pagesSelect!],
                        eventHandler: {
                            change: (e: Event) => {
                                const value = (e.target as HTMLSelectElement).value;
                                setNyaaCategory(value);
                                const q = getQuery();
                                if (q) fetchNyaa({ query: q, filter: getNyaaFilter(), category: value });
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
                        subscriber: [subscribeToLinks],
                        triggerFunction: ($p: HTMLElement) => {
                            $p.textContent = `${getLinks().length} results`;
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
                    getLinks,
                    setPendingMagnet,
                    onDownload,
                    subscribeToLinks,
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
