import { parse } from "node-html-parser";
import type { Entry, IpbModel, IqbModel } from "./types";

export function pbModel(): IpbModel {

    const BASE_URL = process.env.BASE_URL;

    async function fetchEntries(
        searchTerm: string,
        page: number
    ) {
        const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(searchTerm)}/${page}/99/0`);
        const data = await response.text();
        const $page = parse(data);
        const $elements = Array.from($page.querySelectorAll('#searchResult tr')).slice(1);
        return $elements.map(($element) => {
            const title = $element.querySelector('.detName a')?.textContent;
            if (!title) return;
            const cells = Array.from($element.querySelectorAll('> td'));
            const magnet = $element.querySelector('a[href^="magnet:?"]')?.getAttribute('href');
            const leechers = cells.pop()?.textContent;
            const seeders = cells.pop()?.textContent;
            return {
                title,
                magnet,
                leechers,
                seeders,
            };
        }).filter((item) => item?.title);
    }

    async function get({
        searchTerm,
        numOfPages,
    }: {
        searchTerm: string,
        numOfPages: number,
    }) {
        const entries = await Promise.all(
            Array.from({ length: numOfPages }, (_, i) => fetchEntries(searchTerm, i + 1))
        );
        const entriesFlat = entries.flat();
        const uniqueEntries = entriesFlat.filter((entry, index) => entriesFlat.indexOf(entry) === index);
        return uniqueEntries as Entry[];
    }

    return {
        get
    }

}

export function qbModel(): IqbModel {

    const QB_USER = process.env.QB_USER;
    const QB_PASS = process.env.QB_PASS;
    const QB_HOST = process.env.QB_HOST;
    let SID: string | undefined;

    const model = {
        getCookie,
        addMagnet,
        addMagnets,
    };

    async function getCookie() {
        const response = await fetch(`${QB_HOST}/api/v2/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${QB_USER}&password=${QB_PASS}`
        });
        const cookies = response.headers.getSetCookie()[0];
        if (!cookies) throw new Error('No cookies found');
        SID = cookies.split(';')[0]?.split('=')[1];
        return model;
    }

    async function addMagnet(magnetUrl: string) {
        if (!SID) throw new Error('Not authenticated — call getCookie() first');
        const body = new URLSearchParams({ urls: magnetUrl });
        const response = await fetch(`${QB_HOST}/api/v2/torrents/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `SID=${SID}`
            },
            body: body.toString()
        });
        const text = await response.text();
        if (text !== 'Ok.') throw new Error(`qBittorrent rejected magnet: ${text}`);
        return text;
    }

    async function addMagnets(magnetUrls: string[]) {
        for (const url of magnetUrls) {
            await addMagnet(url);
        }
    }

    return model;

}