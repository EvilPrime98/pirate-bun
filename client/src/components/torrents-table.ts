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

    const STATE_ORDER: Record<string, number> = {
        downloading: 0,
        forcedDL: 1,
        metaDL: 2,
        uploading: 3,
        forcedUP: 4,
        stalledDL: 5,
        stalledUP: 6,
        queuedDL: 7,
        queuedUP: 8,
        checkingDL: 9,
        checkingUP: 10,
        moving: 11,
        pausedDL: 12,
        pausedUP: 13,
        error: 14,
        missingFiles: 15,
        unknown: 16,
    };

    const onTorrentsChange = ($tbody: HTMLElement) => {

        const newTorrents = getTorrents().slice().sort((a, b) => {
            const pa = STATE_ORDER[a.state] ?? 99;
            const pb = STATE_ORDER[b.state] ?? 99;
            return pa - pb;
        });
        
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
