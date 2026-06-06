import { UltraFragment, UltraRouter } from "ultra-light.js";
import { PirateBayPage } from './pages/piratebay-page.ts'
import { TorrentsPage } from './pages/torrents-page.ts'
import { NyaaPage } from './pages/nyaa-page.ts'

export function App() {

    return UltraFragment(

        UltraRouter(
            { path: '/', component: PirateBayPage },
            { path: '/torrents', component: TorrentsPage },
            { path: '/nyaa', component: NyaaPage },
            { path: '/*', component: PirateBayPage }
        )

    )

}
