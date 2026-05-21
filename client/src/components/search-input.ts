import { UltraComponent } from "ultra-light.js";
import styles from '../app.module.css';

export function SearchInput({
    setSearch,
    handleSearch
}:{
    setSearch: (search: string) => void,
    handleSearch: (search: string) => void
}) {

    function onInput(
        event: Event
    ) {
        const input = event.target as HTMLInputElement;
        setSearch(input.value);
    }

    function onKeyDown(
        event: Event
    ) {
        const kEvent = event as KeyboardEvent;
        const input = event.target as HTMLInputElement;
        if (kEvent.key === 'Enter') {
            handleSearch(input.value);
        }
    }
    
    return UltraComponent({
        component: '<input/>',
        className: [styles.searchInput!],
        attributes: {
            type: 'text',
            placeholder: 'Search'
        },
        eventHandler: {
            input: onInput,
            keydown: onKeyDown
        }
    })

}