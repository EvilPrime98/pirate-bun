import type { IApiFilters } from '../mainTypes';

const API_URL = import.meta.env.VITE_API_URL;

export async function linksService({
    search,
    pages = 3,
    apiFilters = {}
}: {
    search: string,
    pages?: number,
    apiFilters?: IApiFilters
}) {
    const params = new URLSearchParams({ search, pages: String(pages) });

    const { sort, ...rest } = apiFilters;
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.append(key, value);
    });

    if (sort === 'seeders') params.append('sortBySeeders', '1');
    else if (sort === 'seedersASC') params.append('sortBySeedersASC', '1');
    else if (sort === 'leechers') params.append('sortByLeechers', '1');
    else if (sort === 'leechersASC') params.append('sortByLeechersASC', '1');
    else if (sort === 'size') params.append('sortBySize', '1');
    else if (sort === 'sizeASC') params.append('sortBySizeASC', '1');

    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}

export async function downloadMagnet({
    magnet
}:{
    magnet: string,
}){
    const response = await fetch(`${API_URL}/download`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ magnet })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}
