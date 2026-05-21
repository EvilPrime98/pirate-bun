import { UltraComponent } from "ultra-light.js";
import type { IFilters } from "../hooks/ultraLinks";
import styles from './table-header.module.css';
import { triangleIcon } from "../icons";

export function ThUploadDate({
    filters
}: {
    filters: IFilters
}) {

    const onClick = () => {
        filters.sortByDate.set(!filters.sortByDate.get());
    }

    const onFiltersChange = ($svg: HTMLElement) => {
        $svg.style.rotate = filters.sortByDate.get() ? '180deg' : '0deg';
    }
    
    return UltraComponent({

        component: '<th></th>',

        className: [styles.headerth!, styles.colDate!],

        eventHandler: {
            click: onClick
        },

        children: [

            UltraComponent({

                component: '<span></span>',

                className: [styles.headerth!],

                children: [

                    '<span>Upload Date</span>',

                    UltraComponent({
                        component: triangleIcon(20, 'currentColor'),
                        trigger: [{
                            //@ts-ignore
                            subscriber: filters.subscribe,
                            triggerFunction: onFiltersChange
                        }]
                    })

                ]

            })

        ]

    })
}