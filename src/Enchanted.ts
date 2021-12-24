import {Range} from './Range';
import {Mapping} from './Mapping';

export type Enchanted<T> = Readonly<Range<T>> & Enchanted.Shape<T>;

export namespace Enchanted {
    export class Shape<T> {
        map<T1, T2, T3>(mapper: Mapping<T, T1, T2, T3>): (T1 | T2 | T3) {
            return Range.map(this as unknown as Range<T>, mapper);
        }
    }
}
