import type { HonoRequest } from "hono";

export interface Entry {
    title: string;
    category?: string;
    subcategory?: string;
    uploadDate: string;
    size: string;
    uploadBy: string;
    leechers: string;
    seeders: string;
    magnet: string;
}

export interface IpbModel {
    get: ({
        searchTerm,
        numOfPages,
        request
    }: {
        searchTerm: string,
        numOfPages: number,
        request: HonoRequest
    }) => Promise<Entry[]>;
}

export interface IqbModel {
    getCookie: () => Promise<IqbModel>;
    addMagnet: (magnetUrl: string) => Promise<string>;
    addMagnets: (magnetUrls: string[]) => Promise<void>;
}

export const FILTER_OPTIONS = {
    category: 'category',
    limit: 'limit',
    subcategory: 'subcategory',
    uploadAt: 'uploadAt',
    uploadAfter: 'uploadAfter',
    uploadBefore: 'uploadBefore',
    uploadBy: 'uploadBy',
    minSeeders: 'minSeeders',
    maxSeeders: 'maxSeeders',
    minLeechers: 'minLeechers',
    maxLeechers: 'maxLeechers',
    sortBySeeders: 'sortBySeeders',
    sortBySeedersASC: 'sortBySeedersASC',
    sortByLeechers: 'sortByLeechers',
    sortByLeechersASC: 'sortByLeechersASC',
    sortBySize: 'sortBySize',
    sortBySizeASC: 'sortBySizeASC'
}

export type IFilterOptions = keyof typeof FILTER_OPTIONS;