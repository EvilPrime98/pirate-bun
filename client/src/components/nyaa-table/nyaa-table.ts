import { UltraComponent } from "ultra-light.js";
import tableStyles from '../results-table/results-table.module.css';
import thStyles from '../table-header/table-header.module.css';
import nyaaStyles from './nyaa.module.css';
import type { INyaaLink } from "../../mainTypes";
import { NyaaEntry } from "../nyaa-entry";

export function NyaaTable({
    getFilteredLinks,
    setPendingMagnet,
    onDownload,
    subscribeToLinks,
    subscribeToFilter,
}: {
    getFilteredLinks: () => INyaaLink[];
    setPendingMagnet: (magnet: string | null) => void;
    onDownload: (magnet: string) => void;
    subscribeToLinks: (fn: (value: INyaaLink[]) => void) => () => void;
    subscribeToFilter: (fn: (value: string) => void) => () => void;
}) {

    const onLinksChange = ($tbody: HTMLElement) => {
        $tbody.replaceChildren(
            ...getFilteredLinks().map(link => NyaaEntry({
                link,
                onDangerDownload: setPendingMagnet,
                onDownload,
            }))
        );
    };

    return UltraComponent({

        component: '<table></table>',

        className: [tableStyles.table!],

        children: [

            UltraComponent({
                component: '<thead></thead>',
                className: [tableStyles.tableHeader!],
                children: [
                    UltraComponent({
                        component: '<tr></tr>',
                        children: [
                            '<th>Name</th>',
                            `<th class="${thStyles.colDate}">Date</th>`,
                            `<th class="${nyaaStyles.colSize}">Size</th>`,
                            `<th class="${thStyles.colSeeders}">Seeders</th>`,
                            `<th class="${thStyles.colLeechers}">Leechers</th>`,
                            `<th class="${nyaaStyles.colDownloads}">Downloads</th>`,
                            `<th class="${thStyles.colDownload}">Download</th>`,
                        ]
                    })
                ]
            }),

            UltraComponent({
                component: '<tbody></tbody>',
                trigger: [{
                    subscriber: [subscribeToLinks, subscribeToFilter],
                    triggerFunction: onLinksChange,
                }]
            })

        ]

    });

}
