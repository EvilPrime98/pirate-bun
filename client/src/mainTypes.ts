export interface ILink {
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

export interface IApiFilters {
    category?: string;
    subcategory?: string;
    uploadBy?: string;
    uploadAt?: string;
    uploadAfter?: string;
    uploadBefore?: string;
    minSeeders?: string;
    maxSeeders?: string;
    minLeechers?: string;
    maxLeechers?: string;
    limit?: string;
    sort?: string;
}