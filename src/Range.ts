/* eslint-disable no-null/no-null */
import {Mapping, MappingEntry} from './Mapping';
import {Comparator, compare} from '@pallad/compare';
import {ERRORS} from "./errors";

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

    export function create<T extends NonNullable<{}>>(start: T, end: undefined | null, comparator?: Comparator<T>): Range.Start<T>;
    export function create<T extends NonNullable<{}>>(start: T): Range.Start<T>;
    export function create<T extends NonNullable<{}>>(start: undefined | null, end: T, comparator?: Comparator<T>): Range.End<T>;
    export function create<T extends NonNullable<{}>>(start: T, end: T, comparator?: Comparator<T>): Range.Full<T>;
    export function create<T extends NonNullable<{}>>(start: T | undefined | null, end: T | undefined | null, comparator?: Comparator<T>): Range<T>;
    export function create<T extends NonNullable<{}>>(start: T | undefined | null, end?: T, comparator?: Comparator<T>): Range<T> {
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
            if (compare(start, end, comparator).isGreater) {
                throw ERRORS.START_GREATER_THAN_END.create();
            }
            return {start, end};
        } else if (start !== undefined && start !== null) {
            return {start};
        } else if (end !== undefined && end !== null) {
            return {end};
        }

        throw ERRORS.UNDEFINED_BOUNDARIES.create();
    }

    export function toTuple<T extends NonNullable<{}>>(range: Range.Full<T>): Tuple.Full<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range.Start<T>): Tuple.Start<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range.End<T>): Tuple.End<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range<T>): Tuple<T>;
    export function toTuple<T extends NonNullable<{}>>(range: Range<T>): Tuple<T> {
        return Range.map(range, toTupleMapper) as Tuple<T>;
    }

    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.Start<T>, comparator?: Comparator<T>): Range.Start<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.End<T>, comparator?: Comparator<T>): Range.End<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple.Full<T>, comparator?: Comparator<T>): Range.Full<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple<T>, comparator?: Comparator<T>): Range<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: T[], comparator?: Comparator<T>): Range<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Array<T | undefined | null>, comparator?: Comparator<T>): Range<T>;
    export function fromArray<T extends NonNullable<{}>>(arr: Tuple<T> | T[], comparator?: Comparator<T>): Range<T> {
        if (arr.length === 0) {
            throw ERRORS.EMPTY_ARRAY_ARGUMENT.create();
        }
        return create(arr[0] as any, arr[1] as any, comparator);
    }

    /**
     * Maps range using provided mapper
     *
     * Mapper defines set of functions used for mapping Start, End and Full range.
     */
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
    export function isWithin<T extends NonNullable<{}>>(range: Range<T>,
                                                        value: T,
                                                        exclusive?: boolean | { start?: boolean, end?: boolean },
                                                        comparator?: Comparator<T>) {
        const [isStartExclusive, isEndExclusive] = typeof exclusive === 'object' ?
            [exclusive.start ?? false, exclusive.end ?? false] :
            [exclusive, exclusive];

        return Range.map(range, {
            full({start, end}) {
                return compare(value, start, comparator)[isStartExclusive ? 'isGreater' : 'isGreaterOrEqual'] &&
                    compare(value, end, comparator)[isEndExclusive ? 'isLess' : 'isLessOrEqual'];
            },
            start({start}) {
                return compare(value, start, comparator)[isStartExclusive ? 'isGreater' : 'isGreaterOrEqual'];
            },
            end({end}) {
                return compare(value, end, comparator)[isEndExclusive ? 'isLess' : 'isLessOrEqual'];
            }
        })
    }

    /**
     * Converts given range to another range using mapper on each value.
     *
     * Convenience method over `Range.map`
     */
    export function convert<T extends NonNullable<{}>, TNew extends NonNullable<{}>>(range: Range<T>, mapper: (value: T) => TNew, comparator?: Comparator<TNew>) {
        return Range.map(range, {
            full({start, end}) {
                return create(mapper(start), mapper(end), comparator);
            },
            start({start}) {
                return create(mapper(start), undefined, comparator);
            },
            end({end}) {
                return create(undefined, mapper(end), comparator);
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
