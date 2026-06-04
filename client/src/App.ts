import { UltraRouter } from "ultra-light.js";
import { HomePage } from './pages/home-page.ts'
import { TorrentsPage } from './pages/torrents-page.ts'
import { NyaaPage } from './pages/nyaa-page.ts'

export function App() {

    return UltraRouter(
        { path: '/', component: HomePage },
        { path: '/torrents', component: TorrentsPage },
        { path: '/nyaa', component: NyaaPage },
        { path: '/*', component: HomePage }
    )

}
