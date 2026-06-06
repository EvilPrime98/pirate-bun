import { UltraComponent } from "ultra-light.js";
import styles from '../app.module.css';
import type { ILink } from "../mainTypes";

export function ResultsIndicator({
    getLinks,
    subscribeToLinks,
}:{
    getLinks: () => ILink[],
    subscribeToLinks: (fn: (value: ILink[]) => void) => () => void,
}) {

    const onLinksChange = ($p: HTMLElement) => {
        $p.textContent = `${getLinks().length} results`;
    }

    return UltraComponent({
        component: '<p></p>',
        className: [styles.resultsIndicator!],
        trigger: [{
            subscriber: [subscribeToLinks],
            triggerFunction: onLinksChange
        }]
    })

}