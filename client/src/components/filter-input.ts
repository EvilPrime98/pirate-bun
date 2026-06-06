import { UltraComponent, type UltraTrigger } from "ultra-light.js";
import styles from './filters-panel/filters-panel.module.css';

export function FilterInput({
    type,
    placeholder,
    onInput,
    extraClass,
    trigger,
}: {
    type: string;
    placeholder?: string;
    extraClass?: string;
    onInput?: (event: Event) => void;
    trigger?: UltraTrigger[];
}) {

    return UltraComponent({

        component: '<input/>',

        attributes: {
            type,
            ...(placeholder && { placeholder })
        },

        className: extraClass ? [styles['filterInput']!, extraClass] : [styles['filterInput']!],

        eventHandler: onInput ? { input: onInput } : {},

        ...(trigger && { trigger }),

    });

}
