import { UltraComponent } from "ultra-light.js";
import type { ILink } from "../mainTypes";
import styles from './entry.module.css';
import { warnIcon } from "../icons";
import { downloadMagnet } from "../services/links";

function DangerButton({
    magnet,
    onDangerDownload,
}: {
    magnet: string,
    onDangerDownload: (magnet: string) => void,
}) {
    return UltraComponent({
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
}

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

    async function onClickDownload() {
        try {
            const { error, message, _} = await downloadMagnet({ magnet });
            if (error) throw new Error(message);
        }catch(e){
            console.log(e);
        }
    }

    return UltraComponent({
        
        component: `<tr></tr>`,
        
        className: isDanger ? [styles.dangerZone!] : [],

        children: [
            
            `<td class="${styles.titleCell}">${title}</td>`,
            
            `<td class="${styles.seeders}">
                <span class="${styles.seedersInner}">
                    ${seeders}${isDanger ? warnIcon(13, '#f87171') : ''}
                </span>
            </td>`,
            
            `<td class="${styles.leechers}">${leechers}</td>`,
            
            isDanger 
            ? DangerButton({ magnet, onDangerDownload })
            : UltraComponent({
                component: `<td><a class="${styles.downloadBtn}">Download</a></td>`,
                eventHandler: {
                    click: onClickDownload
                }
            })

        ]

    })

}