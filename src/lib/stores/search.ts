import { writable } from 'svelte/store';

export const createSearchStore = <T extends Record<PropertyKey, any>>(
	data: T[],
	search?: string
) => {
	const { subscribe, set, update } = writable<SearchStoreValue<T>>({
		data,
		filtered: data,
		search: search || ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreValue<T>) => {
	const searchTerm = store.search.toLowerCase().replace(/\s/g, '').trim() || '';
	store.filtered = store.data.filter((item) => {
		return item.searchTerms.toLowerCase().replace(/\s/g, '').trim().includes(searchTerm);
	});
};
