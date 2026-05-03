import { parse } from "node-html-parser";
import type { Entry, IFilterOptions, IpbModel } from "../types";
import type { HonoRequest } from "hono";
import { FILTER_OPTIONS } from "../types";
import { filterModel } from "./filterModel";
import { decodeHtmlText } from "../utilities/decoder";

export function pbModel(): IpbModel {

    const BASE_URL = process.env.BASE_URL;

    function extractFilters(
        request: HonoRequest
    ): Record<IFilterOptions, string | undefined> {
        const filters = {} as Record<IFilterOptions, string | undefined>;
        for (const entry of Object.entries(FILTER_OPTIONS)) {
            const key = entry[0] as IFilterOptions;
            const value = entry[1] as string;
            filters[key] = request.query(value);
        }
        return filters;
    }

    function dateFormatter(
        date: string
    ) {
        let dayTime = '00:00';
        let year = new Date().getFullYear().toString();
        const frs = decodeHtmlText(date).split(' ');
        const monthday = frs[0] as string;
        const tbd = frs[1];
        if (tbd?.includes(':')) {
            dayTime = tbd;
        } else if (tbd) {
            year = tbd;
        }
        return `${year}-${monthday}T${dayTime}Z`;
    }

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
            const info = ($element.querySelector('.detDesc')?.textContent)?.split(',');
            const cells = Array.from($element.querySelectorAll('> td'));
            const magnet = $element.querySelector('a[href^="magnet:?"]')?.getAttribute('href');
            const leechers = cells.pop()?.textContent;
            const seeders = cells.pop()?.textContent;
            const uploadAt = info![0]?.split('Uploaded')[1]?.trim();
            const size = info![1]?.split('Size')[1]?.trim();
            const uploadBy = info![2]?.split('ULed by')[1]?.trim();
            const [categ, subcateg] = $element.querySelectorAll('.vertTh a');
            return {
                title,
                category: categ?.textContent,
                subcategory: subcateg?.textContent,
                uploadDate: dateFormatter(uploadAt!),
                size,
                uploadBy,
                leechers,
                seeders,
                magnet
            };
        }).filter((item) => item?.title);
    }

    function deduplicate(
        entries: Entry[]
    ) {
        const seen = new Set<string>();
        const uniqueEntries = entries.filter(entry => {
            if (!entry?.magnet || seen.has(entry.magnet)) return false;
            seen.add(entry.magnet);
            return true;
        }) as Entry[];
        return uniqueEntries;
    }

    async function get({
        searchTerm,
        numOfPages,
        request
    }: {
        searchTerm: string,
        numOfPages: number,
        request: HonoRequest
    }) {
        const entries = await Promise.all(
            Array.from({ length: numOfPages }, (_, i) => fetchEntries(searchTerm, i + 1))
        );
        const uniqueEntries = deduplicate(entries.flat() as Entry[]);
        const filteredEntries = filterModel(uniqueEntries).filterbyAll(extractFilters(request));
        return filteredEntries;
    }

    return {
        get
    }

}
