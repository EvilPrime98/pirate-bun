import type { TLibraryEntry } from "../mainTypes";

const LIBRARY_URL = import.meta.env.VITE_LIBRARY_URL;

export async function libraryService(): Promise<TLibraryEntry[]> {
    const response = await fetch(LIBRARY_URL);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.directories;
}
