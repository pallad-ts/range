/* eslint-disable no-null/no-null */
import {Mapping, MappingEntry} from './Mapping';

export type Range<T> = Range.Start<T> | Range.End<T> | Range.Full<T>;

export namespace Range {
    export type Full<T> = Start<T> & End<T>;
    export namespace Full {
        export function is<T = any>(value: any): value is Full<T> {
            return typeof value === 'object' && value !== null && 'start' in value && 'end' in value;
        }
    }

    export interface Start<T> {
        start: T;
    }

    export namespace Start {
        export function is<T = any>(value: any): value is Start<T> {
            return typeof value === 'object' && value !== null && 'start' in value;
        }
    }

    export interface End<T> {
        end: T;
    }

    export namespace End {
        export function is<T = any>(value: any): value is End<T> {
            return typeof value === 'object' && value !== null && 'end' in value;
        }
    }

    export const isStart = Start.is;
    export const isEnd = End.is;
    export const isFull = Full.is;

    export function is<T>(value: any): value is Range<T> {
        return Full.is(value) || Start.is(value) || End.is(value);
    }

    export type Type<T extends Range<unknown>> = T extends Range<infer U> ? U : never;

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

    export function fromTuple<T>(arr: [T] | [T, T]): Range<T> {
        if (arr.length === 1) {
            return create(arr[0]);
        }
        return create(arr[0], arr[1]);
    }

    export function fromArray<T>(arr: T[]): Range<T> {
        if (arr.length === 0) {
            throw new TypeError('Cannot create range from empty array');
        }
        return create(arr[0], arr[1]);
    }

    export function map<T, TR1, TR2, TR3>(range: Range<T>, mapper: Mapping<T, TR1, TR2, TR3>): (TR1 | TR2 | TR3) {
        if (Range.Full.is(range)) {
            return callMapping(mapper.full, range);
        } else if (Range.Start.is(range)) {
            return callMapping(mapper.start, range);
        }
        return callMapping(mapper.end, range);
    }

    function callMapping<TMapping extends MappingEntry<any, any>, TRange extends Range<any>>(mapping: TMapping, range: TRange) {
        if (typeof mapping === 'function') {
            return mapping(range);
        }
        return mapping;
    }
}
