import { writable, type Writable } from 'svelte/store';

type ProgressType = {
	start: () => void;
	complete: () => void;
};

const createProgressStore = () => {
	const { subscribe, update, set }: Writable<ProgressType | undefined> = writable(undefined);

	return {
		subscribe,
		update,
		set,
		start: () => {
			update((progress) => {
				if (progress) progress.start();
				return progress;
			});
		},
		complete: () => {
			update((progress) => {
				if (progress) progress.complete();
				return progress;
			});
		}
	};
};

export const progress = createProgressStore();
