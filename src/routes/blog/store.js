import { writable } from 'svelte/store';
import { Curtains} from "curtainsjs/src/index.mjs";
import { onMount } from "svelte";

onMount(() => {
     const curtains = writable(new Curtains({
    }));
});
export const curtains = curtains