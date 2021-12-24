import {Range} from './Range';
import {Mapping} from './Mapping';
import * as is from 'predicates';

export type Enchanted<T> = Readonly<Range<T>> & Enchanted.Shape<T>;

const TYPE_KEY = '@type';
const TYPE = '@pallad/range/enchanted';

const isType = is.property(TYPE_KEY, is.strictEqual(TYPE));

export namespace Enchanted {
    export function is<T = unknown>(range: any): range is Enchanted<T> {
        return range instanceof Shape || isType(range);
    }

    export class Shape<T> {
        constructor() {
            Object.defineProperty(this, TYPE_KEY, {
                value: TYPE,
                configurable: false,
                enumerable: false
            });
        }

        map<T1, T2 = T1, T3 = T2>(mapper: Mapping<T, T1, T2, T3>): (T1 | T2 | T3) {
            return Range.map(this as unknown as Range<T>, mapper);
        }

        isWithin(value: T, exclusive?: boolean | { start?: boolean, end?: boolean }) {
            return Range.isWithin(this as unknown as Range<T>, value, exclusive);
        }

        toTuple() {
            return Range.toTuple(this as unknown as Range<T>);
        }
    }
}
