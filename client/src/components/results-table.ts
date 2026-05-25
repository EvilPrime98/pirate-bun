import { UltraComponent } from "ultra-light.js";
import styles from './results-table.module.css';
import type { ILink } from "../mainTypes";
import { Entry } from "./entry";
import type { IFilters } from "../hooks/ultraLinks";
import { TableHeader } from "./table-header";

export function ResultsTable({
    getFilteredLinks,
    setPendingMagnet,
    onDownload,
    subscribeToLinks,
    subscribeToFilter,
    filters
}: {
    getFilteredLinks: () => ILink[];
    setPendingMagnet: (magnet: string | null) => void;
    onDownload: (magnet: string) => void;
    subscribeToLinks: (fn: (value: ILink[]) => void) => () => void;
    subscribeToFilter: (fn: (value: string) => void) => () => void;
    filters: IFilters;
}) {

    const onLinksChange = ($tbody: HTMLElement) => {
        $tbody.replaceChildren(
            ...getFilteredLinks().map(link => Entry({
                link,
                onDangerDownload: setPendingMagnet,
                onDownload,
            }))
        )
    }

    return UltraComponent({

        component: '<table></table>',

        className: [styles.table!],

        children: [

            UltraComponent({
                component: '<thead></thead>',
                children: [
                    TableHeader({ filters })   
                ],
                className: [styles.tableHeader!]
            }),

            UltraComponent({
                component: '<tbody></tbody>',
                trigger: [{
                    subscriber: [subscribeToLinks, subscribeToFilter],
                    triggerFunction: onLinksChange,
                }]
            })

        ]

    })
}
