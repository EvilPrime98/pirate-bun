export interface Entry {
    title: string;
    magnet: string;
    leechers: string;
    seeders: string;
}

export interface IpbModel {
    get: ({
        searchTerm,
        numOfPages,
    }: {
        searchTerm: string,
        numOfPages: number,
    }) => Promise<Entry[]>;
}

export interface IqbModel {
    getCookie: () => Promise<IqbModel>;
    addMagnet: (magnetUrl: string) => Promise<string>;
    addMagnets: (magnetUrls: string[]) => Promise<void>;
}