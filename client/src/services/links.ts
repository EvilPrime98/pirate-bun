const API_URL = import.meta.env.VITE_API_URL;

export async function linksService({
    search,
    pages = 3,
}: {
    search: string,
    pages?: number,
}) {
    const response = await fetch(`${API_URL}?search=${search}&pages=${pages}`);
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
