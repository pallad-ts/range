import {Range} from "./Range";

export function create<T>(start: T, end: T): Range.Full<T>;
export function create<T>(start: T, end: undefined | null): Range.Start<T>;
export function create<T>(start: T): Range.Start<T>;
export function create<T>(start: undefined | null, end: T): Range.End<T>;
export function create<T>(start?: T, end?: T): Range<T> {
    if (start !== undefined && start !== null && end !== undefined && end !== null) {
        return {start, end};
    } else if (start !== undefined && start !== null) {
        return {start};
    } else if (end !== undefined && end !== null) {
        return {end};
    }

    throw new TypeError('Cannot create Range from undefined or null values');
}