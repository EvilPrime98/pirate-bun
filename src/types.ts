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