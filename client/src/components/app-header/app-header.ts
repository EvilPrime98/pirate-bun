import { UltraComponent, UltraLink } from "ultra-light.js";
import styles from '../../app.module.css';

export function Header() {

    return UltraComponent({

        component: '<div></div>',

        className: [styles.homeHeader!],

        children: [

            UltraComponent({
                component: '<h1>PirateBay</h1>',
                className: [styles.title!],
                styles: {
                    viewTransitionName: 'pbclient-to-home'
                }
            }),

            UltraLink({
                href: '/nyaa',
                children: [
                    UltraComponent({
                        component: '<span>Nyaa</span>',
                        styles: {
                            viewTransitionName: 'nyaa-to-nyaa'
                        }
                    })
                ],
                viewTransition: true
            }),

            UltraLink({
                href: '/torrents',
                children: [
                    UltraComponent({
                        component: '<span>Torrents</span>',
                        styles: {
                            viewTransitionName: 'torrents-to-torrents'
                        }
                    })
                ],
                viewTransition: true
            }),

        ]

    })

}