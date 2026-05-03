import { UltraActivity, UltraComponent, ultraQuery, ultraState, ultraStyles } from "ultra-light.js";
import type { ILink } from './mainTypes';
import styles from './app.module.css';

const API_URL = import.meta.env.API_URL;

const queryProvider = ultraQuery();

const warnIcon = (size: number, stroke: string) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}

const warnIconLarge = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}

async function linksService({
    search,
    pages = 3,
}: {
    search: string,
    pages?: number,
}) {
    const response = await fetch(`${API_URL}?search=${search}&pages=${pages}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}

function ultraLinks() {

    const [getLinks, setLinks, subscribeToLinks] = ultraState<ILink[]>([]);

    async function fetchComics({
        search,
        pages = 1
    }:{
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
        getLinks,
        subscribeToLinks,
        fetchComics
    }

}

function Entry({
    link,
    onDangerDownload,
}: {
    link: ILink,
    onDangerDownload: (magnet: string) => void,
}) {

    const { title, magnet, leechers, seeders } = link;
    const ratio = leechers > 0 ? seeders / leechers : Infinity;
    const isDanger = seeders < 3 || ratio < 0.05;

    const downloadCell = isDanger
    ? `<td><a href="${magnet}" class="${styles.downloadBtn}">Download</a></td>`
    : UltraComponent({
        component: '<td></td>',
        children: [
            UltraComponent({
                component: `<button>${warnIcon(12, 'currentColor')}<span>Download</span></button>`,
                className: [styles.downloadBtn!, styles.downloadBtnDanger!],
                eventHandler: {
                    click: () => onDangerDownload(magnet)
                }
            })
        ]
    });

    return UltraComponent({
        component: `<tr></tr>`,
        className: isDanger ? [styles.dangerZone!] : [],
        children: [
            `<td class="${styles.titleCell}">${title}</td>`,
            `<td class="${styles.seeders}"><span class="${styles.seedersInner}">${seeders}${isDanger ? warnIcon(13, '#f87171') : ''}</span></td>`,
            `<td class="${styles.leechers}">${leechers}</td>`,
            downloadCell,
        ]
    })

}

export function App() {

    const { getLinks, subscribeToLinks, fetchComics } = ultraLinks();
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

            UltraActivity({
                component: '<div></div>',
                mode: {
                    state: () => queryProvider.isFetching(),
                    subscriber: queryProvider.subscribeToFetching,
                },
                className: [styles.loader!],
                children: [`<div class="${styles.spinner}"></div>`]
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

            UltraActivity({
                
                component: '<div></div>',
                
                mode: {
                    state: () => getPendingMagnet() !== null,
                    subscriber: subscribeToPendingMagnet,
                },

                className: [styles.modalOverlay!],

                children: [

                    UltraComponent({
                        
                        component: '<div></div>',
                        
                        className: [styles.modalDialog!],
                        
                        children: [
                            `<div class="${styles.modalTitle}">${warnIconLarge} Low seeder warning</div>`,
                            `<p class="${styles.modalBody}">This torrent has fewer than 200 seeders and may download slowly or stall. Are you sure you want to proceed?</p>`,
                            
                            UltraComponent({
                                
                                component: '<div></div>',
                                
                                className: [styles.modalActions!],
                                
                                children: [
                                    
                                    UltraComponent({
                                        component: '<button>Cancel</button>',
                                        className: [styles.modalCancel!],
                                        eventHandler: {
                                            click: () => setPendingMagnet(null)
                                        }
                                    }),
                                    
                                    UltraComponent({
                                        component: '<button>Download anyway</button>',
                                        className: [styles.modalConfirm!],
                                        eventHandler: {
                                            click: () => {
                                                const magnet = getPendingMagnet();
                                                if (magnet) window.location.href = magnet;
                                                setPendingMagnet(null);
                                            }
                                        }
                                    })

                                ]
                            })

                        ]

                    })

                ]
            })

        ]

    })

}
