import { UltraActivity, UltraComponent } from "ultra-light.js";
import styles from './low-seeders-modal.module.css';
import { warnIconLarge } from "../icons";

export function LowSeedersModal({
    getPendingMagnet,
    setPendingMagnet,
    subscribeToPendingMagnet,
}: {
    getPendingMagnet: () => string | null,
    setPendingMagnet: (magnet: string | null) => void,
    subscribeToPendingMagnet: (fn: (value: string | null) => void) => () => void,
}){

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

                    `<div class="${styles.modalTitle}">${warnIconLarge()} Low seeder warning</div>`,

                    `<p class="${styles.modalBody}">
                        This torrent does not satisfy the minimum requirements for seeding and may download slowly or stall.
                        Are you sure you want to proceed?
                    </p>`,

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
                                component: '<button>Download anyway</button>',
                                className: [styles.modalConfirm!],
                                eventHandler: {
                                    click: () => {
                                        const magnet = getPendingMagnet();
                                        if (magnet) window.location.href = magnet;
                                        setPendingMagnet(null);
                                    }
                                }
                            })

                        ]
                    })

                ]

            })

        ]

    })

}