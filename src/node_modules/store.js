import { writable, derived } from 'svelte/store';
import series from "../../static/db/Photoseries.json";
import { tweened } from 'svelte/motion';
import { cubicOut, linear } from 'svelte/easing';

// const series = phseries.filter(el => el.Type === 'wedding')

export const progress = tweened(0, {
    duration: 1000,
    easing: cubicOut
});
export const eventAnimation = writable(true);
export const homePageState = writable(false);
export const photoseries = writable(series);
export const photoseriesSort = writable(series);

export const inrtoAnimationStart = writable(false)
export const leaveIndex = writable(false)
export const leaveRoute = writable(false)
export const showPrelader = writable(true);
export const paddingCoef = writable(0.12);
export const titleIndex = writable(0);
export const activePhotoseries = writable(0);
export const typePhotoseries = writable(0);
