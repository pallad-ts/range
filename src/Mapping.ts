import {Range} from './Range';

export interface Mapping<T, TR1, TR2 = TR1, TR3 = TR2> {
    start: MappingEntry<Range.Start<T>, TR1>;
    end: MappingEntry<Range.End<T>, TR2>;
    full: MappingEntry<Range.Full<T>, TR3>;
}

export type MappingEntry<T extends Range<any>, TResult> = ((range: T) => TResult) | TResult;
