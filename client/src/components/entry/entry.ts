import { UltraComponent } from "ultra-light.js";
import type { ILink } from "../../mainTypes";
import styles from './entry.module.css';
import { warnIcon } from "../../icons";
import { DangerButton } from "../danger-button";

export function Entry({
    link,
    onDangerDownload,
    onDownload,
}: {
    link: ILink,
    onDangerDownload: (magnet: string) => void,
    onDownload: (magnet: string) => void,
}) {

    const { title, magnet } = link;
    const uploadDate = (link.uploadDate).split('T')[0];
    const leechers = Number(link.leechers);
    const seeders = Number(link.seeders);
    const ratio = leechers > 0 ? seeders / leechers : Infinity;
    const isDanger = seeders < 3 || ratio < 0.05;

    return UltraComponent({

        component: `<tr></tr>`,

        className: isDanger ? [styles.dangerZone!] : [],

        children: [

            `<td class="${styles.titleCell}">${title}</td>`,

            `<td>${uploadDate}</td>`,

            `<td class="${styles.seeders}">
                <span class="${styles.seedersInner}">
                    ${seeders}${isDanger ? warnIcon(13, '#f87171') : ''}
                </span>
            </td>`,

            `<td class="${styles.leechers}">${leechers}</td>`,

            isDanger
            ? DangerButton({ magnet, onDangerDownload })
            : UltraComponent({
                component: `<td></td>`,
                children: [
                    UltraComponent({
                        component: '<a>Download</a>',
                        className: [styles.downloadBtn!],
                        eventHandler: {
                            click: () => onDownload(magnet)
                        }
                    })
                ],
            })

        ],

    })

}
