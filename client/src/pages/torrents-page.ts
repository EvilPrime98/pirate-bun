import { UltraActivity, UltraComponent, UltraLink } from "ultra-light.js";
import styles from './torrents.module.css';
import { ultraTorrents } from "../hooks/ultraTorrents";
import { TorrentsTable } from "../components/torrents-table";
import { Loader } from "../components/loader/loader";

export function TorrentsPage() {

    const {
        queryProvider,
        getTorrents,
        subscribeToTorrents,
        fetchTorrents,
        startPolling,
        stopPolling,
    } = ultraTorrents();

    return UltraComponent({

        onMount: [startPolling],

        cleanup: [stopPolling],

        component: '<main></main>',

        className: [styles.page!],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.header!],

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

                    UltraLink({
                        href: '/nyaa',
                        children: [
                            UltraComponent({
                                component: '<span>Nyaa</span>',
                                styles: {
                                    viewTransitionName: 'nyaa-to-nyaa'
                                }
                            })
                        ],
                        viewTransition: true
                    }),

                    UltraComponent({
                        component: '<h1>Torrents</h1>',
                        className: [styles.title!],
                        styles: {
                            viewTransitionName: 'torrents-to-torrents'
                        }
                    }),

                ]

            }),

            UltraComponent({
                component: '<div></div>',
                className: [styles.toolbar!],
                children: [

                    UltraComponent({
                        component: '<button>Refresh</button>',
                        className: [styles.refreshBtn!],
                        eventHandler: {
                            click: () => fetchTorrents()
                        }
                    }),

                    UltraActivity({
                        component: '<span></span>',
                        className: [styles.count!],
                        mode: {
                            state: () => getTorrents().length > 0,
                            subscriber: subscribeToTorrents,
                        },
                        trigger: [{
                            subscriber: subscribeToTorrents,
                            triggerFunction: ($el: HTMLElement) => {
                                $el.textContent = `${getTorrents().length} torrent${getTorrents().length !== 1 ? 's' : ''}`;
                            }
                        }]
                    }),

                ]
            }),

            Loader({
                stateFunction: () => queryProvider.isFetching(),
                subscribers: queryProvider.subscribeToFetching,
            }),

            UltraActivity({
                component: TorrentsTable({
                    getTorrents,
                    subscribeToTorrents,
                }),
                mode: {
                    state: () => !queryProvider.isFetching(),
                    subscriber: queryProvider.subscribeToFetching,
                }
            }),

        ]

    });

}
