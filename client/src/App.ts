import { UltraActivity, UltraComponent, ultraState } from "ultra-light.js";
import styles from './app.module.css';
import { ultraLinks } from "./hooks/ultraLinks";
import { Entry } from "./components/entry";
import { warnIconLarge } from "./icons";
import { LowSeedersModal } from "./components/low-seeders-modal";
import { Loader } from "./components/loader";

export function App() {

    const { getLinks, subscribeToLinks, fetchComics, queryProvider } = ultraLinks();
    const [,setSearch,] = ultraState<string>('');
    const [getPages, setPages] = ultraState<number>(1);
    const [getFilter, setFilter, subscribeToFilter] = ultraState<string>('');
    const [getPendingMagnet, setPendingMagnet, subscribeToPendingMagnet] = ultraState<string | null>(null);

    function getFilteredLinks() {
        const filter = getFilter().toLowerCase().trim();
        return filter
        ? getLinks().filter(link => link.title.toLowerCase().includes(filter))
        : getLinks();
    }

    function onLinksChange($tbody: HTMLElement) {
        $tbody.replaceChildren(
            ...getFilteredLinks().map(link => Entry({
                link,
                onDangerDownload: setPendingMagnet
            }))
        )
    }

    return UltraComponent({

        component: '<main></main>',

        className: [styles.app!],

        children: [

            `<h1 class="${styles.title}">PBClient</h1>`,

            UltraComponent({
                
                component: '<div></div>',
                
                className: [styles.searchRow!],

                children: [
                    
                    UltraComponent({
                        component: '<input/>',
                        className: [styles.searchInput!],
                        attributes: {
                            type: 'text',
                            placeholder: 'Search'
                        },
                        eventHandler: {
                            input: (event: Event) => {
                                const input = event.target as HTMLInputElement;
                                setSearch(input.value);
                            },
                            keydown: (event: Event) => {
                                const kEvent = event as KeyboardEvent;
                                const input = event.target as HTMLInputElement;
                                if (kEvent.key === 'Enter') {
                                    fetchComics({ search: input.value, pages: getPages() });
                                }
                            }
                        }
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
                component: '<p></p>',
                mode: {
                    state: () => getLinks().length > 0,
                    subscriber: subscribeToLinks,
                },
                className: [styles.resultsIndicator!],
                trigger: [
                    {
                        subscriber: subscribeToLinks,
                        triggerFunction: ($el: HTMLElement) => {
                            $el.textContent = `${getFilteredLinks().length} results`;
                        }
                    },
                    {
                        subscriber: subscribeToFilter,
                        triggerFunction: ($el: HTMLElement) => {
                            $el.textContent = `${getFilteredLinks().length} results`;
                        }
                    }
                ]
            }),

            Loader({
                stateFunction: () => queryProvider.isFetching(),
                subscribers: queryProvider.subscribeToFetching,
            }),

            UltraActivity({

                component: '<table></table>',

                mode: {
                    state: () => !queryProvider.isFetching(),
                    subscriber: queryProvider.subscribeToFetching,
                },

                className: [styles.table!],

                children: [

                    UltraComponent({
                        component:`<thead>
                            <tr>
                                <th>Title</th>
                                <th>Seeders</th>
                                <th>Leechers</th>
                                <th>Download</th>
                            </tr>
                        </thead>`,
                        className: [styles.tableHeader!]
                    }),

                    UltraComponent({
                        component: '<tbody></tbody>',
                        trigger: [
                            {
                                subscriber: subscribeToLinks,
                                triggerFunction: onLinksChange,
                            },
                            {
                                subscriber: subscribeToFilter,
                                triggerFunction: onLinksChange,
                            }
                        ],
                    })

                ]

            }),

            LowSeedersModal({
                getPendingMagnet,
                setPendingMagnet,
                subscribeToPendingMagnet,
            })

        ]

    })

}
