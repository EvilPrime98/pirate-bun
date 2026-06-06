import type { ITorrent } from '../mainTypes';

const QB_URL = import.meta.env.VITE_QB_URL;

export async function torrentsService(): Promise<ITorrent[]> {
    const response = await fetch(`${QB_URL}/torrents`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.torrents;
}

export async function deleteTorrentService(hash: string, fileRemoval: boolean): Promise<void> {
    const response = await fetch(`${QB_URL}/torrents/${hash}?fileRemoval=${fileRemoval}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message ?? response.statusText);
    }
}
