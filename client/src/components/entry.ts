import { UltraComponent } from "ultra-light.js";
import type { ILink } from "../mainTypes";
import styles from './entry.module.css';
import { warnIcon } from "../icons";

export function Entry({
    link,
    onDangerDownload,
}: {
    link: ILink,
    onDangerDownload: (magnet: string) => void,
}) {

    const { title, magnet, leechers, seeders } = link;
    const ratio = leechers > 0 ? seeders / leechers : Infinity;
    const isDanger = seeders < 3 || ratio < 0.05;

    return UltraComponent({
        
        component: `<tr></tr>`,
        
        className: isDanger ? [styles.dangerZone!] : [],

        children: [
            
            `<td class="${styles.titleCell}">${title}</td>`,
            
            `<td class="${styles.seeders}">
                <span class="${styles.seedersInner}">${seeders}${isDanger ? warnIcon(13, '#f87171') : ''}</span>
            </td>`,
            
            `<td class="${styles.leechers}">${leechers}</td>`,
            
            !isDanger ? `<td><a href="${magnet}" class="${styles.downloadBtn}">Download</a></td>`
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
            })

        ]

    })

}