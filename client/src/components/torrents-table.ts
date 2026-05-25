import { UltraComponent, type UltraLightElement } from "ultra-light.js";
import styles from '../pages/torrents.module.css';
import type { ITorrent } from "../mainTypes";
import { TorrentEntry, updateTorrentEntry } from "./torrent-entry";

export function TorrentsTable({
    getTorrents,
    subscribeToTorrents,
}: {
    getTorrents: () => ITorrent[];
    subscribeToTorrents: (fn: (value: ITorrent[]) => void) => () => void;
}) {

    const rowMap = new Map<string, { element: UltraLightElement; data: ITorrent }>();

    const onTorrentsChange = ($tbody: HTMLElement) => {
        
        const newTorrents = getTorrents();
        
        const newHashes = new Set(newTorrents.map(t => t.hash));

        for (const [hash, { element }] of rowMap) {
            if (!newHashes.has(hash)) {
                element._cleanup?.();
                element.remove();
                rowMap.delete(hash);
            }
        }

        newTorrents.forEach((torrent, index) => {
            
            const existing = rowMap.get(torrent.hash);

            if (existing) {
                updateTorrentEntry(existing.element, torrent, existing.data);
                existing.data = { ...torrent };
                const atIndex = $tbody.children[index];
                if (atIndex !== existing.element) {
                    $tbody.insertBefore(existing.element, atIndex ?? null);
                }
            } else {
                const element = TorrentEntry({ torrent }) as HTMLElement;
                rowMap.set(torrent.hash, { element, data: { ...torrent } });
                $tbody.insertBefore(element, $tbody.children[index] ?? null);
            }
            
        });

    };

    return UltraComponent({
        component: '<table></table>',
        className: [styles.table!],
        children: [

            UltraComponent({
                component: '<thead></thead>',
                className: [styles.tableHeader!],
                children: [
                    `<tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>Progress</th>
                        <th>↓ Speed</th>
                        <th>↑ Speed</th>
                        <th>Size</th>
                        <th>Ratio</th>
                    </tr>`
                ]
            }),

            UltraComponent({
                component: '<tbody></tbody>',
                trigger: [{
                    subscriber: [subscribeToTorrents],
                    triggerFunction: onTorrentsChange,
                }]
            }),

        ]
    });

}
