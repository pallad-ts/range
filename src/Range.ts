export type Range<T> = Range.Start<T> | Range.End<T> | Range.Full<T>;

export namespace Range {
    export type Full<T> = Start<T> & End<T>;
    export namespace Full {
        export function is<T = any>(value: any): value is Full<T> {
            return value && 'start' in value && 'end' in value;
        }
    }

    export interface Start<T> {
        start: T;
    }

    export namespace Start {
        export function is<T = any>(value: any): value is Start<T> {
            return value && 'start' in value;
        }
    }

    export interface End<T> {
        end: T;
    }

    export namespace End {
        export function is<T = any>(value: any): value is End<T> {
            return value && 'end' in value;
        }
    }

    export const isStart = Start.is;
    export const isEnd = End.is;
    export const isFull = Full.is;

    export function is<T>(value: any): value is Range<T> {
        return Full.is(value) || Start.is(value) || End.is(value);
    }
}