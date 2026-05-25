import { UltraRouter } from "ultra-light.js";
import { HomePage } from './pages/home-page.ts'
import { TorrentsPage } from './pages/torrents-page.ts'

export function App() {

    return UltraRouter(
        { path: '/', component: HomePage },
        { path: '/torrents', component: TorrentsPage },
        { path: '/*', component: HomePage }
    )

}
