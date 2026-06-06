import type { IqbModel } from "../types";

export function qbModel(): IqbModel {

    const QB_USER = process.env.QB_USER;
    const QB_PASS = process.env.QB_PASS;
    const QB_HOST = process.env.QB_HOST;
    let SID: string | undefined;

    const model = {
        getCookie,
        getVersion,
        addMagnet,
        addMagnets,
        getTorrents,
        getTorrent,
        deleteTorrent
    };

    async function getCookie() {
        const response = await fetch(`${QB_HOST}/api/v2/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${QB_USER}&password=${QB_PASS}`
        });
        const cookies = response.headers.getSetCookie()[0];
        if (!cookies) throw new Error('No cookies found');
        SID = cookies.split(';')[0]?.split('=')[1];
        return model;
    }

    async function getVersion() {

        if (!SID) throw new Error('Not authenticated — call getCookie() first');

        const response = await fetch(`${QB_HOST}/api/v2/app/version`, {
            method: 'GET',
            headers: {
                'Cookie': `SID=${SID}`
            }
        });

        const text = await response.text();
        if (!response.ok) throw new Error(text || response.statusText);
        return text;

    }

    async function addMagnet(
        magnetUrl: string, 
        savePath?: string
    ) {      
        
        if (!SID) throw new Error('Not authenticated — call getCookie() first');      
        
        const body = new URLSearchParams({ urls: magnetUrl });       
        
        if (savePath) body.set('savepath', savePath);
        
        const response = await fetch(`${QB_HOST}/api/v2/torrents/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `SID=${SID}`
            },
            body: body.toString()
        });

        const text = await response.text();
        
        if (text !== 'Ok.') throw new Error(`qBittorrent rejected magnet: ${text}`);
        
        return text;     

    }

    async function addMagnets(
        magnetUrls: string[]
    ) {
        for (const url of magnetUrls) {
            await addMagnet(url);
        }
    }

    async function getTorrents() {
        const response = await fetch(`${QB_HOST}/api/v2/torrents/info`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Cookie': `SID=${SID}` 
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(response.statusText);
        return data;
    }

    async function getTorrent(
        hash: string
    ) {
        const response = await fetch(`${QB_HOST}/api/v2/torrents/info?hashes=${hash}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Cookie': `SID=${SID}` 
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(response.statusText);
        return data;
    }

    async function deleteTorrent(
        hash: string,
        deleteFiles: boolean
    ) {
        if (!SID) throw new Error('Not authenticated — call getCookie() first');

        const body = new URLSearchParams({ hashes: hash, deleteFiles: String(deleteFiles) });

        const response = await fetch(`${QB_HOST}/api/v2/torrents/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `SID=${SID}`
            },
            body: body.toString()
        });

        if (!response.ok) throw new Error(response.statusText);
    }

    return model;

}
