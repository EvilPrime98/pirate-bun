import { UltraComponent } from "ultra-light.js";
import styles from './filters-panel.module.css';

export function InlineLabel({ 
    text 
}: { 
    text: string 
}) {

    return UltraComponent({
        component: `<span>${text}</span>`,
        className: [styles['inlineLabel']!],
    });
    
}
