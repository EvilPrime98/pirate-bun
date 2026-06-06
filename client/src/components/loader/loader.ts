import { UltraActivity } from "ultra-light.js";
import styles from './loader.module.css';

export function Loader({
    stateFunction,
    subscribers
}:{
    stateFunction: () => boolean,
    subscribers: ((fn: (value: boolean) => void) => () => void) | ((fn: (value: boolean) => void) => () => void)[],
}) {
    return UltraActivity({
        component: '<div></div>',
        mode: {
            state: stateFunction,
            subscriber: subscribers,
        },
        className: [styles.loader!],
        children: [`<div class="${styles.spinner}"></div>`]
    })
}