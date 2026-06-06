import { UltraComponent } from "ultra-light.js";
import styles from './entry/entry.module.css';
import { warnIcon } from "../icons";

export function DangerButton({
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