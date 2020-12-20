import photoseries from "db/Photoseries.json"
import { writable } from 'svelte/store';

export const ph = writable(photoseries);
export const eventAnimation = writable(true);