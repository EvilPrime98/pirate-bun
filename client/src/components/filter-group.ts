import { UltraComponent } from "ultra-light.js";
import styles from './filters-panel.module.css';

export function FilterGroup({ 
    label, 
    children 
}: {
    label: string;
    children: (HTMLElement | Node | string | null)[];
}) {

    return UltraComponent({
        component: '<div></div>',
        className: [styles['filterGroup']!],
        children: [
            UltraComponent({
                component: `<span>${label}</span>`,
                className: [styles['groupLabel']!],
            }),
            UltraComponent({
                component: '<div></div>',
                className: [styles['groupInputs']!],
                children,
            }),
        ],
    });

}
