import { UltraComponent } from "ultra-light.js";
import type { ITorrent } from "../mainTypes";
import styles from '../pages/torrents.module.css';
import { formatSize, formatSpeed } from "../utils/format";
import { DeleteCell } from "./delete-cell/delete-cell";

const stateClass = (state: string): string => {
    if (state.includes('download') || state === 'metaDL') return styles.stateDownloading!;
    if (state.includes('seed') || state === 'uploading') return styles.stateSeeding!;
    if (state.includes('pause')) return styles.statePaused!;
    if (state === 'error') return styles.stateError!;
    if (state.includes('stall')) return styles.stateStalled!;
    if (state.includes('check')) return styles.stateChecking!;
    return styles.stateDefault!;
}

export function TorrentEntry({ torrent, onDelete }: {
    torrent: ITorrent;
    onDelete: (hash: string, deleteFiles: boolean) => void;
}) {

    const progress = Math.round(torrent.progress * 100);

    return UltraComponent({

        component: '<tr></tr>',

        children: [

            `<td class="${styles.nameCell}" title="${torrent.name}">${torrent.name}</td>`,

            `<td><span class="${styles.stateText} ${stateClass(torrent.state)}">${torrent.state}</span></td>`,

            UltraComponent({
                component: '<td></td>',
                children: [
                    `<div class="${styles.progressBar}">
                        <div class="${styles.progressFill}" style="width: ${progress}%;"></div>
                    </div>`,
                    `<span class="${styles.progressText}">${progress}%</span>`
                ]
            }),

            `<td class="${styles.speed} ${styles.dlSpeed}">${formatSpeed(torrent.dlspeed)}</td>`,

            `<td class="${styles.speed} ${styles.upSpeed}">${formatSpeed(torrent.upspeed)}</td>`,

            `<td class="${styles.sizeCell}">${formatSize(torrent.size)}</td>`,

            `<td class="${styles.ratio}">${torrent.ratio.toFixed(2)}</td>`,

            DeleteCell({ hash: torrent.hash, onDelete }),

        ]

    });

}

export function updateTorrentEntry(
    row: HTMLElement,
    next: ITorrent,
    prev: ITorrent
): void {

    const cells = row.children;

    if (next.state !== prev.state) {
        const span = cells[1]?.querySelector('span');
        if (span) {
            span.textContent = next.state;
            span.className = `${styles.stateText} ${stateClass(next.state)}`;
        }
    }

    if (next.progress !== prev.progress) {
        const pct = Math.round(next.progress * 100);
        const fill = cells[2]?.querySelector(`.${styles.progressFill}`) as HTMLElement | null;
        const text = cells[2]?.querySelector(`.${styles.progressText}`);
        if (fill) fill.style.width = `${pct}%`;
        if (text) text.textContent = `${pct}%`;
    }

    if (next.dlspeed !== prev.dlspeed) {
        if (cells[3]) cells[3].textContent = formatSpeed(next.dlspeed);
    }

    if (next.upspeed !== prev.upspeed) {
        if (cells[4]) cells[4].textContent = formatSpeed(next.upspeed);
    }

    if (next.ratio !== prev.ratio) {
        if (cells[6]) cells[6].textContent = next.ratio.toFixed(2);
    }

}
