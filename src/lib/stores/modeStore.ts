import { writable } from "svelte/store";
import type { Mode } from '$lib/types';

function createModeStore() {
    const { subscribe, set } = writable<Mode>(null);

    return {
        subscribe,
        setMode: (mode: Mode) => set(mode),
        reset: () => set(null)
    };
}

export const modeStore = createModeStore();