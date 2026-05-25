import { ultraQuery, ultraState } from "ultra-light.js";
import { libraryService } from "../services/library";
import type { TLibraryEntry } from "../mainTypes";

export function ultraLibrary() {

    const queryProvider = ultraQuery();

    const [getDirectories, setDirectories, subscribeToDirectories] = ultraState<TLibraryEntry[]>([]);

    async function fetchDirectories() {
        
        const { data } = await queryProvider.fetch(
            'library-directories', 
            libraryService
        );

        if (!queryProvider.hasError() && data) setDirectories(data);

    }

    return {
        queryProvider,
        getDirectories,
        subscribeToDirectories,
        fetchDirectories,
    }

}
