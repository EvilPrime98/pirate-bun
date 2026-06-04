export const NYAA_API_URL = import.meta.env.VITE_NYAA_API_URL;

export async function linksService({
    query,
    filter,
    category
}: {
    query: string,
    filter?: string
    category?: string
}) {
    const params = new URLSearchParams({
        query
    });
    if (filter) params.set('filter', filter);
    if (category) params.set('category', category);
    const response = await fetch(`${NYAA_API_URL}/torrents?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}
