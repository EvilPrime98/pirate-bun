import { UltraActivity, UltraComponent } from "ultra-light.js";
import styles from './download-dir-modal.module.css';
import { ultraQBDownload } from "../../hooks/ultraQBDownload";
import type { TLibraryEntry } from "../../mainTypes";

export function DownloadDirModal({
    getPendingMagnet,
    setPendingMagnet,
    subscribeToPendingMagnet,
    getDirectories,
    subscribeToDirectories,
}: {
    getPendingMagnet: () => string | null,
    setPendingMagnet: (magnet: string | null) => void,
    subscribeToPendingMagnet: (fn: (value: string | null) => void) => () => void,
    getDirectories: () => TLibraryEntry[],
    subscribeToDirectories: (fn: (value: TLibraryEntry[]) => void) => () => void,
}) {

    const { download } = ultraQBDownload();

    let selectedDirectory = '';

    const onDirectoriesChange = ($el: HTMLElement) => {
        
        const dirs = getDirectories();
        
        const $select = $el as HTMLSelectElement;
        
        $select.replaceChildren(
            ...dirs.map(dir => {
                return UltraComponent({
                    component: `<option>${dir.name || '/'}</option>`,
                    attributes: { value: dir.relativePath },
                })
            })
        );

        if (dirs.length > 0) selectedDirectory = dirs[0]?.relativePath!;
        
    };

    return UltraActivity({

        component: '<div></div>',

        mode: {
            state: () => getPendingMagnet() !== null,
            subscriber: subscribeToPendingMagnet,
        },

        className: [styles.modalOverlay!],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.modalDialog!],

                children: [

                    `<div class="${styles.modalTitle}">Select download directory</div>`,

                    UltraComponent({
                        component: '<select></select>',
                        className: [styles.dirSelect!],
                        onMount: [onDirectoriesChange],
                        trigger: [{
                            subscriber: subscribeToDirectories,
                            triggerFunction: onDirectoriesChange,
                        }],
                        eventHandler: {
                            change: (event: Event) => {
                                selectedDirectory = (event.target as HTMLSelectElement).value;
                            }
                        }
                    }),

                    UltraComponent({

                        component: '<div></div>',

                        className: [styles.modalActions!],

                        children: [

                            UltraComponent({
                                component: '<button>Cancel</button>',
                                className: [styles.modalCancel!],
                                eventHandler: {
                                    click: () => setPendingMagnet(null)
                                }
                            }),

                            UltraComponent({
                                component: '<button>Download</button>',
                                className: [styles.modalConfirm!],
                                eventHandler: {
                                    click: async () => {
                                        const magnet = getPendingMagnet();
                                        if (magnet) {
                                            await download({ magnet, directory: selectedDirectory });
                                        }
                                        setPendingMagnet(null);
                                    }
                                }
                            }),

                        ]

                    })

                ]

            })

        ]

    })

}
