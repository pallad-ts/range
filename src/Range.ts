/* eslint-disable no-null/no-null */
import {Mapping, MappingEntry} from './Mapping';
import {compare} from '@pallad/compare';
import {Either, right, left} from '@sweet-monads/either';

export type Range<T extends NonNullable<{}>> = Range.Full<T> | Range.Start<T> | Range.End<T>;

const toTupleMapper: Mapping<NonNullable<{}>, Range.Tuple<NonNullable<{}>>> = {
    start({start}) {
        return [start];
    },
    end({end}) {
        return [undefined, end];
    },
    full({start, end}) {
        return [start, end];
    }
};

function fromTry<T>(fn: () => T): Either<string, T> {
    try {
        return right(fn());
    } catch (e: any) {
        return left(e.message);
    }
}

export namespace Range {
    export type Full<T extends NonNullable<{}>> = Start<T> & End<T>;
    export namespace Full {
        export function is<T extends NonNullable<{}> = any>(value: any): value is Full<T> {
            return typeof value === 'object' && value !== null && 'start' in value && 'end' in value;
        }
    }

    export interface Start<T extends NonNullable<{}>> {
        start: T;
    }

    export namespace Start {
        export function is<T extends NonNullable<{}> = any>(value: any): value is Start<T> {
            return typeof value === 'object' && value !== null && 'start' in value;
        }
    }

    export interface End<T extends NonNullable<{}>> {
        end: T;
    }

    export namespace End {
        export function is<T extends NonNullable<{}> = any>(value: any): value is End<T> {
            return typeof value === 'object' && value !== null && 'end' in value;
        }
    }

    export const isStart = Start.is;
    export const isEnd = End.is;
    export const isFull = Full.is;

    export function is<T extends NonNullable<{}> = any>(value: any): value is Range<T> {
        return Full.is(value) || Start.is(value) || End.is(value);
    }

    export type Type<T extends Range<any>> = T extends Range<infer U> ? U : never;

    export type Tuple<T> = Tuple.Start<T> | Tuple.End<T> | Tuple.Full<T>;

    export namespace Tuple {
        export type Start<T> = [T] | [T, undefined | null];
        export type End<T> = [undefined | null, T];
        export type Full<T> = [T, T];
    }

    export function create<T extends NonNullable<{}>>(start: T, end: undefined | null): Range.Start<T>;
    export function create<T extends NonNullable<{}>>(start: T): Range.Start<T>;
    export function create<T extends NonNullable<{}>>(start: undefined | null, end: T): Range.End<T>;
    export function create<T extends NonNullable<{}>>(start: T, end: T): Range.Full<T>;
    export function create<T extends NonNullable<{}>>(start: T | undefined | null, end?: T): Range<T> {
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
            if (compare(start, end).isGreater) {
                throw new TypeError('"start" cannot be greater than "end"');
            }
            return {start, end};
        } else if (start !== undefined && start !== null) {
            return {start};
        } else if (end !== undefined && end !== null) {
            return {end};
        }

        throw new TypeError('Cannot create Range from undefined or null values');
    }

    export namespace create {
        export function either<T extends NonNullable<{}>>(start: T, end: undefined | null): Either<string, Range.Start<T>>;
        export function either<T extends NonNullable<{}>>(start: T): Either<string, Range.Start<T>>;
        export function either<T extends NonNullable<{}>>(start: undefined | null, end: T): Either<string, Range.End<T>>;
        export function either<T extends NonNullable<{}>>(start: T, end: T): Either<string, Range.Full<T>>;
        export function either<T extends NonNullable<{}>>(start: T | undefined | null, end?: T): Either<string, Range<T>> {
            return fromTry<Range<T>>(() => {
                return create<T>(start as any, end as any);
            });
        }
    }

    export function toTuple<T extends NonNullable<{}>>(range: Range.Full<T>): Tuple.Full<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range.Start<T>): Tuple.Start<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range.End<T>): Tuple.End<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range<T>): Tuple<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range<T>): Tuple<T> {
        return Range.map(range, toTupleMapper) as Tuple<T>;
    }

    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.Start<T>): Range.Start<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.End<T>): Range.End<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.Full<T>): Range.Full<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple<T>): Range<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: T[]): Range<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple<T> | T[]): Range<T> {
        if (arr.length === 0) {
            throw new TypeError('Cannot create range from empty array');
        }
        return create(arr[0] as any, arr[1] as any);
    }

    export namespace fromArray {
        export function either<T extends NonNullable<{}>>(arr: Tuple.Start<T>): Either<string, Range.Start<T>>;
        export function either<T extends NonNullable<{}>>(arr: Tuple.End<T>): Either<string, Range.End<T>>;
        export function either<T extends NonNullable<{}>>(arr: Tuple.Full<T>): Either<string, Range.Full<T>>;
        export function either<T extends NonNullable<{}>>(arr: Tuple<T>): Either<string, Range<T>>;
        export function either<T extends NonNullable<{}>>(arr: T[]): Either<string, Range<T>>;
        export function either<T extends NonNullable<{}>>(arr: Tuple<T> | T[]): Either<string, Range<T>> {
            return fromTry(() => fromArray(arr as any) as Range<T>);
        }
    }

    export function map<T extends NonNullable<{}>, TR1, TR2 = TR1, TR3 = TR2>(range: Range<T>, mapper: Mapping<T, TR1, TR2, TR3>): (TR1 | TR2 | TR3) {
        if (Range.Full.is(range)) {
            return callMapping(mapper.full, range);
        } else if (Range.Start.is(range)) {
            return callMapping(mapper.start, range);
        }
        return callMapping(mapper.end, range);
    }

    /**
     * Checks whether given value falls in range
     *
     * `exclusive` param describes whether to perform exclusive check - by default false
     */
    export function isWithin<T extends NonNullable<{}>>(range: Range<T>, value: T, exclusive?: boolean | { start?: boolean, end?: boolean }) {
        const [isStartExclusive, isEndExclusive] = typeof exclusive === 'object' ?
            [exclusive.start ?? false, exclusive.end ?? false] :
            [exclusive, exclusive];

        return Range.map(range, {
            full({start, end}) {
                return compare(value, start)[isStartExclusive ? 'isGreater' : 'isGreaterOrEqual'] &&
                    compare(value, end)[isEndExclusive ? 'isLess' : 'isLessOrEqual'];
            },
            start({start}) {
                return compare(value, start)[isStartExclusive ? 'isGreater' : 'isGreaterOrEqual'];
            },
            end({end}) {
                return compare(value, end)[isEndExclusive ? 'isLess' : 'isLessOrEqual'];
            }
        })
    }
}


function callMapping<TMapping extends MappingEntry<any, any>, TRange extends Range<any>>(mapping: TMapping, range: TRange) {
    if (typeof mapping === 'function') {
        return mapping(range);
    }
    return mapping;
}
