import { UltraComponent, ultraState } from "ultra-light.js";
import type { ILink } from "../mainTypes";
import styles from './entry.module.css';
import { warnIcon } from "../icons";
import { DangerButton } from "./danger-button";
import { ultraQBDownload } from "../hooks/ultraQBDownload";

export function Entry({
    link,
    onDangerDownload,
}: {
    link: ILink,
    onDangerDownload: (magnet: string) => void,
}) {

    const { title, magnet } = link;
    const uploadDate = (link.uploadDate).split('T')[0];
    const leechers = Number(link.leechers);
    const seeders = Number(link.seeders);
    const ratio = leechers > 0 ? seeders / leechers : Infinity;
    const isDanger = seeders < 3 || ratio < 0.05;
    const { queryProvider: downloadProvider, download } = ultraQBDownload();
    const [buttonText, setButtonText, subscribeToButtonText] = ultraState('Download');

    const onClickDownload = async () => {
        await download({ magnet });
    }

    const onFetchingChange = ($a: HTMLElement) => {
        $a.classList.toggle(styles.downloading!, downloadProvider.isFetching());
    }

    const onButtonTextChange = ($a: HTMLElement) => {
        $a.innerText = buttonText();
    }

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
                eventHandler: {
                    click: onClickDownload
                },
                children: [
                    UltraComponent({
                        component: '<a></a>',
                        className: [styles.downloadBtn!],
                        onMount: [onFetchingChange, onButtonTextChange],
                        trigger: [
                            {
                                subscriber: downloadProvider.subscribeToFetching,
                                triggerFunction: onFetchingChange
                            },
                            {
                                subscriber: subscribeToButtonText,
                                triggerFunction: onButtonTextChange
                            }
                        ]
                    })
                ],
            })

        ],

        trigger: [
            { 
                subscriber: subscribeToButtonText,
                triggerFunction: () => {
                    const newText = downloadProvider.isFetching() ? 'Downloading...' : 'Download';
                    setButtonText(newText);
                }
            }
        ]

    })

}