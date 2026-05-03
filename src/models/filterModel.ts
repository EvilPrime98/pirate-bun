import type { Entry, IFilterOptions } from "../types";
import { decodeHtmlText } from "../utilities/decoder";

export function filterModel(
    entries: Entry[]
) {

    let db = [...entries];

    const model = {
        filterByCategory,
        filterBySubcategory,
        filterByUploader,
        filterbySeeders,
        filterbyLeechers,
        filterByUploadAt,
        filterByUploadAfter,
        filterByUploadBefore,
        filterByLimit,
        filterbyAll,
        sortBySeeders,
        sortByLeechers,
        sortBySize,
        get
    }
    
    function filterbyAll(
        filters: Record<IFilterOptions, string | undefined>
    ) {
        return model
        .filterByCategory(filters.category)
        .filterBySubcategory(filters.subcategory)
        .filterByUploader(filters.uploadBy)
        .filterbyLeechers(filters.minLeechers, filters.maxLeechers)
        .filterbySeeders(filters.minSeeders, filters.maxSeeders)
        .filterByUploadAt(filters.uploadAt, filters.uploadAfter, filters.uploadBefore)
        .filterByUploadAfter(filters.uploadAfter, filters.uploadAt)
        .filterByUploadBefore(filters.uploadBefore, filters.uploadAt)
        .sortBySeeders(filters.sortBySeeders || filters.sortBySeedersASC, filters.sortBySeedersASC !== undefined)
        .sortByLeechers(filters.sortByLeechers || filters.sortByLeechersASC, filters.sortByLeechersASC !== undefined)
        .sortBySize(filters.sortBySize || filters.sortBySizeASC, filters.sortBySizeASC !== undefined)
        .filterByLimit(filters.limit)
        .get();
    }

    function filterbySeeders(
        min: string | undefined, 
        max: string | undefined
    ) {
        if (!min && !max) return model;
        db = db.filter(e => {
            const s = Number(e.seeders);
            if (min && max) return s >= Number(min) && s <= Number(max);
            if (min) return s >= Number(min);
            return s <= Number(max);
        });
        return model;
    }

    function filterbyLeechers(
        min: string | undefined, 
        max: string | undefined
    ) {
        if (!min && !max) return model;
        db = db.filter(e => {
            const l = Number(e.leechers);
            if (min && max) return l >= Number(min) && l <= Number(max);
            if (min) return l >= Number(min);
            return l <= Number(max);
        });
        return model;
    }

    function filterByCategory(
        categ: string | undefined
    ) {
        if (!categ) return model;
        db = db.filter(e => e.category?.toLowerCase().includes(categ.toLowerCase()));
        return model;
    }

    function filterBySubcategory(
        subcat: string | undefined
    ) {
        if (!subcat) return model;
        db = db.filter(e => e.subcategory?.toLowerCase().includes(subcat.toLowerCase()));
        return model;
    }

    function filterByUploader(
        uploader: string | undefined
    ) {
        if (!uploader) return model;
        db = db.filter(e => e.uploadBy?.toLowerCase().includes(uploader.toLowerCase()));
        return model;
    }

    function filterByUploadAt(
        date: string | undefined,
        after: string | undefined,
        before: string | undefined
    ) {
        if (!date) return model;
        if (after || before) return model;
        const [year, month, day] = date.split('-');
        db = db.filter(e => {
            const d = new Date(e.uploadDate);
            return d.getFullYear() === Number(year) && d.getMonth() === Number(month) - 1 && d.getDate() === Number(day);
        });
        return model;
    }

    function filterByUploadAfter(
        date: string | undefined, // YYYY-MM-DD
        at: string | undefined
    ) {
        if (!date) return model;
        if (at) return model;
        const [year, month, day] = date.split('-');
        db = db.filter(e => {
            const d = new Date(e.uploadDate);
            return d.getFullYear() === Number(year) && d.getMonth() === Number(month) - 1 && d.getDate() > Number(day);
        });
        return model;
    }

    function filterByUploadBefore(
        date: string | undefined, // YYYY-MM-DD
        at: string | undefined
    ) {
        if (!date) return model;
        if (at) return model;
        const [year, month, day] = date.split('-');
        db = db.filter(e => {
            const d = new Date(e.uploadDate);
            return d.getFullYear() === Number(year) && d.getMonth() === Number(month) - 1 && d.getDate() < Number(day);
        });
        return model;
    }

    function filterByLimit(
        limit: string | undefined
    ) {
        if (!limit) return model;
        db = db.slice(0, Number(limit));
        return model;
    }

    function sortBySeeders(
        ind: string | undefined,
        asc: boolean = false
    ){
        if (!ind) return model;
        if (asc) db.sort((a, b) => Number(a.seeders) - Number(b.seeders));
        else db.sort((a, b) => Number(b.seeders) - Number(a.seeders));
        return model;
    }

    function sortByLeechers(
        ind: string | undefined,
        asc: boolean = false
    ){
        if (!ind) return model;
        if (asc) db.sort((a, b) => Number(a.leechers) - Number(b.leechers));
        else db.sort((a, b) => Number(b.leechers) - Number(a.leechers));
        return model;
    }

    function sortBySize(
        ind: string | undefined,
        asc: boolean = false
    ){
        if (!ind) return model;
        const getSize = (e: Entry) => {
            const frs = decodeHtmlText(e.size).split(' ');
            let value = Number(frs[0]);
            let unit = frs[1];
            if (unit === 'GiB') value = Number(value) * 1024;
            return value;
        }
        if (asc) db.sort((a, b) => getSize(a) - getSize(b));
        else db.sort((a, b) => getSize(b) - getSize(a));
        return model;       
    }

    function get() {
        return db;
    }

    return model;

}