import { UltraActivity, UltraComponent, ultraState, ultraCompState, type UltraTrigger } from "ultra-light.js";
import styles from './filters-panel.module.css';
import type { IApiFilters } from '../mainTypes';
import { FilterInput } from '../filter-input';
import { InlineLabel } from '../inline-label';
import { FilterGroup } from '../filter-group';

export function FiltersPanel({
    onApply
}: {
    onApply: (filters: IApiFilters) => void;
}) {

    const [getOpen, setOpen, subscribeToOpen] = ultraState<boolean>(false);

    const filters = ultraCompState({
        category: '',
        subcategory: '',
        uploader: '',
        uploadAt: '',
        uploadAfter: '',
        uploadBefore: '',
        minSeeders: '',
        maxSeeders: '',
        minLeechers: '',
        maxLeechers: '',
        limit: '',
        sort: '',
    });

    const syncTrigger = (
        getter: () => string,
        subscriber: (fn: (value: any) => void) => () => void
    ): UltraTrigger[] => {
        return [
            {
                subscriber,
                triggerFunction: ($el: HTMLElement) => {
                    ($el as HTMLInputElement).value = getter();
                },
                defer: true
            }
        ]
    };

    const readFilters = (): IApiFilters => {
        const f: IApiFilters = {};
        if (filters.category.get()) f.category = filters.category.get();
        if (filters.subcategory.get()) f.subcategory = filters.subcategory.get();
        if (filters.uploader.get()) f.uploadBy = filters.uploader.get();
        if (filters.uploadAt.get()) f.uploadAt = filters.uploadAt.get();
        if (filters.uploadAfter.get()) f.uploadAfter = filters.uploadAfter.get();
        if (filters.uploadBefore.get()) f.uploadBefore = filters.uploadBefore.get();
        if (filters.minSeeders.get()) f.minSeeders = filters.minSeeders.get();
        if (filters.maxSeeders.get()) f.maxSeeders = filters.maxSeeders.get();
        if (filters.minLeechers.get()) f.minLeechers = filters.minLeechers.get();
        if (filters.maxLeechers.get()) f.maxLeechers = filters.maxLeechers.get();
        if (filters.limit.get()) f.limit = filters.limit.get();
        if (filters.sort.get()) f.sort = filters.sort.get();
        return f;
    };

    const handleApply = () => onApply(readFilters());

    const handleReset = () => {
        filters.category.set('');
        filters.subcategory.set('');
        filters.uploader.set('');
        filters.uploadAt.set('');
        filters.uploadAfter.set('');
        filters.uploadBefore.set('');
        filters.minSeeders.set('');
        filters.maxSeeders.set('');
        filters.minLeechers.set('');
        filters.maxLeechers.set('');
        filters.limit.set('');
        filters.sort.set('');
        onApply({});
    };

    return UltraComponent({

        component: '<div></div>',

        className: [styles['filtersPanel']!],

        children: [

            UltraComponent({
                component: '<button>▼ More Filters</button>',
                className: [styles['toggleBtn']!],
                trigger: [{
                    subscriber: subscribeToOpen,
                    triggerFunction: ($btn: HTMLElement) => {
                        $btn.textContent = getOpen() ? '▲ Less Filters' : '▼ More Filters';
                    }
                }],
                eventHandler: {
                    click: () => setOpen(!getOpen())
                }
            }),

            UltraActivity({

                component: '<div></div>',

                className: [styles['panelBody']!],

                mode: {
                    state: getOpen,
                    subscriber: subscribeToOpen,
                },

                children: [

                    FilterGroup({

                        label: 'Text Filters',

                        children: [

                            FilterInput({
                                type: 'text',
                                placeholder: 'Category',
                                onInput: (e) => filters.category.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.category.get, filters.category.subscribe),
                            }),

                            FilterInput({
                                type: 'text',
                                placeholder: 'Subcategory',
                                onInput: (e) => filters.subcategory.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.subcategory.get, filters.subcategory.subscribe),
                            }),

                            FilterInput({
                                type: 'text',
                                placeholder: 'Uploader',
                                onInput: (e) => filters.uploader.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.uploader.get, filters.uploader.subscribe),
                            }),

                        ]

                    }),

                    FilterGroup({

                        label: 'Date',

                        children: [
                            InlineLabel({ text: 'At' }),
                            FilterInput({
                                type: 'date',
                                onInput: (e) => filters.uploadAt.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.uploadAt.get, filters.uploadAt.subscribe),
                            }),
                            InlineLabel({ text: 'After' }),
                            FilterInput({
                                type: 'date',
                                onInput: (e) => filters.uploadAfter.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.uploadAfter.get, filters.uploadAfter.subscribe),
                            }),
                            InlineLabel({ text: 'Before' }),
                            FilterInput({
                                type: 'date',
                                onInput: (e) => filters.uploadBefore.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.uploadBefore.get, filters.uploadBefore.subscribe),
                            }),
                        ]

                    }),

                    FilterGroup({
                        label: 'Seeders',
                        children: [
                            InlineLabel({ text: 'Min' }),
                            FilterInput({
                                type: 'number',
                                placeholder: 'Min',
                                extraClass: styles['filterInputSm']!,
                                onInput: (e) => filters.minSeeders.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.minSeeders.get, filters.minSeeders.subscribe),
                            }),
                            InlineLabel({ text: 'Max' }),
                            FilterInput({
                                type: 'number',
                                placeholder: 'Max',
                                extraClass: styles['filterInputSm']!,
                                onInput: (e) => filters.maxSeeders.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.maxSeeders.get, filters.maxSeeders.subscribe),
                            }),
                        ]
                    }),

                    FilterGroup({
                        label: 'Leechers',
                        children: [
                            InlineLabel({ text: 'Min' }),
                            FilterInput({
                                type: 'number',
                                placeholder: 'Min',
                                extraClass: styles['filterInputSm']!,
                                onInput: (e) => filters.minLeechers.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.minLeechers.get, filters.minLeechers.subscribe),
                            }),
                            InlineLabel({ text: 'Max' }),
                            FilterInput({
                                type: 'number',
                                placeholder: 'Max',
                                extraClass: styles['filterInputSm']!,
                                onInput: (e) => filters.maxLeechers.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.maxLeechers.get, filters.maxLeechers.subscribe),
                            }),
                        ]
                    }),

                    FilterGroup({

                        label: 'Sort & Limit',

                        children: [

                            UltraComponent({
                                component: `<select>
                                    <option value="">Default order</option>
                                    <option value="seeders">Seeders ↓</option>
                                    <option value="seedersASC">Seeders ↑</option>
                                    <option value="leechers">Leechers ↓</option>
                                    <option value="leechersASC">Leechers ↑</option>
                                    <option value="size">Size ↓</option>
                                    <option value="sizeASC">Size ↑</option>
                                </select>`,
                                className: [styles['filterSelect']!],
                                eventHandler: {
                                    change: (e) => filters.sort.set((e.target as HTMLSelectElement).value)
                                },
                                trigger: [{
                                    subscriber: filters.sort.subscribe,
                                    triggerFunction: ($el: HTMLElement) => {
                                        ($el as HTMLSelectElement).value = filters.sort.get();
                                    }
                                }]
                            }),

                            InlineLabel({ text: 'Limit' }),

                            FilterInput({
                                type: 'number',
                                placeholder: 'Limit',
                                extraClass: styles['filterInputSm']!,
                                onInput: (e) => filters.limit.set((e.target as HTMLInputElement).value),
                                trigger: syncTrigger(filters.limit.get, filters.limit.subscribe),
                            }),

                        ]

                    }),

                    UltraComponent({

                        component: '<div></div>',

                        className: [styles['actions']!],

                        children: [

                            UltraComponent({
                                component: '<button>Reset</button>',
                                className: [styles['resetBtn']!],
                                eventHandler: { click: handleReset }
                            }),

                            UltraComponent({
                                component: '<button>Apply Filters</button>',
                                className: [styles['applyBtn']!],
                                eventHandler: { click: handleApply }
                            }),

                        ]

                    })

                ]
            })

        ]

    });
}
