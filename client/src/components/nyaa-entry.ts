import { UltraComponent } from "ultra-light.js";
import type { INyaaLink } from "../mainTypes";
import styles from './entry.module.css';
import { warnIcon } from "../icons";
import { DangerButton } from "./danger-button";

export function NyaaEntry({
    link,
    onDangerDownload,
    onDownload,
}: {
    link: INyaaLink;
    onDangerDownload: (magnet: string) => void;
    onDownload: (magnet: string) => void;
}) {

    const { name, magnet, size, downloads } = link;
    const date = link.date.split(' ')[0];
    const leechers = Number(link.leechers);
    const seeders = Number(link.seeders);
    const ratio = leechers > 0 ? seeders / leechers : Infinity;
    const isDanger = seeders < 3 || ratio < 0.05;

    return UltraComponent({

        component: '<tr></tr>',

        className: isDanger ? [styles.dangerZone!] : [],

        children: [

            `<td class="${styles.titleCell}">${name}</td>`,

            `<td>${date}</td>`,

            `<td>${size}</td>`,

            `<td class="${styles.seeders}">
                <span class="${styles.seedersInner}">
                    ${seeders}${isDanger ? warnIcon(13, '#f87171') : ''}
                </span>
            </td>`,

            `<td class="${styles.leechers}">${leechers}</td>`,

            `<td>${downloads}</td>`,

            isDanger
                ? DangerButton({ magnet, onDangerDownload })
                : UltraComponent({
                    component: '<td></td>',
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

    });

}
