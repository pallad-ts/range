/* eslint-disable no-null/no-null */
import {Mapping, MappingEntry} from './Mapping';
import {Validation} from 'monet';

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

    export function create<T>(start: T, end: T): Validation<string, Range.Full<T>>;
    export function create<T>(start: T, end: undefined | null): Validation<string, Range.Start<T>>;
    export function create<T>(start: T): Validation<string, Range.Start<T>>;
    export function create<T>(start: undefined | null, end: T): Validation<string, Range.End<T>>;
    export function create<T>(start?: T, end?: T): Validation<string, Range<T>> {
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
            return Validation.Success({start, end});
        } else if (start !== undefined && start !== null) {
            return Validation.Success({start});
        } else if (end !== undefined && end !== null) {
            return Validation.Success({end});
        }

        return Validation.Fail('Cannot create Range from undefined or null values');
    }

    export function fromTuple<T>(arr: [T] | [T, T]): Validation<string, Range<T>> {
        if (arr.length === 1) {
            return create(arr[0]);
        }
        return create(arr[0], arr[1]);
    }

    export function fromArray<T>(arr: T[]): Validation<string, Range<T>> {
        if (arr.length === 0) {
            return Validation.Fail('Cannot create range from empty array');
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

    export function isWithin<T>(range: Range<T>, value: T, exclusive?: boolean | { start?: boolean, end?: boolean }) {
        const [isStartExclusive, isEndExclusive] = typeof exclusive === 'object' ?
            [exclusive.start ?? false, exclusive.end ?? false] :
            [exclusive, exclusive];

        return Range.map(range, {
            full({start, end}) {
                return com
            }
        })
    }

    function callMapping<TMapping extends MappingEntry<any, any>, TRange extends Range<any>>(mapping: TMapping, range: TRange) {
        if (typeof mapping === 'function') {
            return mapping(range);
        }
        return mapping;
    }
}
