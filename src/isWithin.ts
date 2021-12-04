import {Range} from "./Range";
import {map} from "./map";

export function isWithin<T>(range: Range<T>, value: T, inclusive: boolean | [boolean, boolean] = true) {
    const [isStartInclusive, isEndInclusive] = Array.isArray(inclusive) ? [
        inclusive[0] ?? true,
        inclusive[1] ?? true
    ] : [inclusive, inclusive];

    const satisfiesStartRange = 'start' in range ? (isStartInclusive ? range.start >= value : range.start > value) : true;
    const satisfiesEndRange = 'end' in range ? (isEndInclusive ? range.end <= value : range.end < value) : true;
    return map(range, {
        full: satisfiesStartRange && satisfiesEndRange,
        start: satisfiesStartRange,
        end: satisfiesEndRange
    });
}