import {Range} from "./Range";

export function map<T extends Range<any>, TResult>(range: T, mapper: map.Mapper<Range.Type<T>, TResult>) {
    if (Range.Full.is(range)) {
        return callMapping(mapper.full, range);
    } else if (Range.Start.is(range)) {
        return callMapping(mapper.start, range);
    }
    return callMapping(mapper.end, range);
}

function callMapping<TMapping extends map.Mapping<any, any>, TRange extends Range<any>>(mapping: TMapping, range: TRange) {
    if (typeof mapping === 'function') {
        return mapping(range);
    }

    return mapping;
}

export namespace map {
    export interface Mapper<T, TResult> {
        start: Mapping<Range.Start<T>, TResult>;
        end: Mapping<Range.End<T>, TResult>;
        full: Mapping<Range.Full<T>, TResult>;
    }

    export type Mapping<T extends Range<any>, TResult> = ((range: T) => TResult) | TResult;
}