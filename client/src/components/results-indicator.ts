import { UltraComponent } from "ultra-light.js";
import styles from '../app.module.css';
import type { ILink } from "../mainTypes";

export function ResultsIndicator({
    getFilteredLinks,
    subscribeToLinks,
    subscribeToFilter
}:{
    getFilteredLinks: () => ILink[],
    subscribeToLinks: (fn: (value: ILink[]) => void) => () => void,
    subscribeToFilter: (fn: (value: string) => void) => () => void
}) {

    const onLinksChange = ($p: HTMLElement) => {
        $p.textContent = `${getFilteredLinks().length} results`;
    }
    
    return UltraComponent({
        component: '<p></p>',
        className: [styles.resultsIndicator!],
        trigger: [{
            subscriber: [subscribeToLinks, subscribeToFilter],
            triggerFunction: onLinksChange
        }]
    })

}