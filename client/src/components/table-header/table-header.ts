import { UltraComponent } from "ultra-light.js";
import type { IFilters } from "../hooks/ultraLinks";
import { triangleIcon } from "../../icons";
import styles from './table-header.module.css';
import { ThUploadDate } from "../th-upload-date";

export function TableHeader({
    filters
}:{
    filters: IFilters
}) {

    return UltraComponent({
        
        component: '<tr></tr>',
       
        children: [
            
            UltraComponent({
                component: '<th>Title</th>',
            }),
            
            ThUploadDate({ filters }),

            UltraComponent({

                component: '<th></th>',

                className: [styles.headerth!, styles.colSeeders!],

                eventHandler: {
                    click: () =>{
                        filters.sortBySeedersASC.set(!filters.sortBySeedersASC.get());
                    }
                },

                children: [
                    UltraComponent({
                        component: '<span></span>',
                        className: [styles.headerth!],
                        children: [
                            '<span>Seeders</span>',
                            triangleIcon(20, 'currentColor')
                        ]
                    })
                ]

            }),
            
            UltraComponent({

                component: '<th></th>',

                className: [styles.headerth!, styles.colLeechers!],

                eventHandler: {
                    click: () =>{
                        filters.sortByLeechersASC.set(!filters.sortByLeechersASC.get());
                    }
                },
                
                children: [
                    UltraComponent({
                        component: '<span></span>',
                        className: [styles.headerth!],
                        children: [
                            '<span>Leechers</span>',
                            triangleIcon(20, 'currentColor')
                        ]
                    })
                ]

            }),
            
            UltraComponent({
                component: '<th>Download</th>',
                className: [styles.headerth!, styles.colDownload!]
            }),

        ]

    })

}