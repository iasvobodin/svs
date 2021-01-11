import photoseries from "db/Photoseries.json"
import { writable } from 'svelte/store';

export const ph = writable(photoseries);
export const eventAnimation = writable(true);
export const leaveRoute = writable(false);
export const leaveIndex = writable(false);
export const titlePlaneLoad = writable(false);
