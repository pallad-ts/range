import {Range} from './Range';

export interface Mapping<T extends NonNullable<{}>, TR1, TR2 = TR1, TR3 = TR2> {
    /**
     * Maps range that has only start boundary
     */
    start: MappingEntry<Range.Start<T>, TR1>;
    /**
     * Maps range that has only end boundary
     */
    end: MappingEntry<Range.End<T>, TR2>;
    /**
     * Maps range that has both start and end boundaries
     */
    full: MappingEntry<Range.Full<T>, TR3>;
}

export type MappingEntry<T extends Range<any>, TResult> = ((range: T) => TResult) | TResult;
