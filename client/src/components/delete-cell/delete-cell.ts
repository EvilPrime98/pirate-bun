import { UltraActivity, UltraComponent, ultraState } from "ultra-light.js";
import styles from './delete-cell.module.css';
import { trashIcon } from "../../icons";

export function DeleteCell({ hash, onDelete }: {
    hash: string;
    onDelete: (hash: string, deleteFiles: boolean) => void;
}) {

    const [isConfirming, setIsConfirming, subscribeToConfirming] = ultraState(false);

    return UltraComponent({

        component: '<td></td>',

        className: [styles.deleteCell!],

        children: [

            UltraComponent({
                component: `<button>${trashIcon()}</button>`,
                className: [styles.deleteBtn!],
                eventHandler: { click: () => setIsConfirming(true) },
                trigger: [{
                    subscriber: subscribeToConfirming,
                    triggerFunction: ($el: HTMLElement) => {
                        $el.style.opacity = isConfirming() ? '0' : '1';
                        $el.style.pointerEvents = isConfirming() ? 'none' : '';
                    }
                }]
            }),

            UltraActivity({

                component: '<div></div>',

                className: [styles.confirmPanel!],

                children: [

                    UltraComponent({
                        component: '<span>Delete torrent?</span>',
                        className: [styles.confirmLabel!],
                    }),

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.confirmActions!],
                        children: [

                            UltraComponent({
                                component: '<button>Keep files</button>',
                                className: [styles.confirmKeepBtn!],
                                eventHandler: { click: () => onDelete(hash, false) }
                            }),

                            UltraComponent({
                                component: '<button>Delete files</button>',
                                className: [styles.confirmFilesBtn!],
                                eventHandler: { click: () => onDelete(hash, true) }
                            }),

                        ]
                    }),

                    UltraComponent({
                        component: '<button>Cancel</button>',
                        className: [styles.confirmCancelBtn!],
                        eventHandler: { click: () => setIsConfirming(false) }
                    }),

                ],

                mode: {
                    state: () => isConfirming(),
                    subscriber: subscribeToConfirming,
                }

            }),

        ]
    });
}
