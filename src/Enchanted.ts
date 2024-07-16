import {Range} from './Range';
import {Mapping} from './Mapping';
import {TypeCheck} from "@pallad/type-check";
import {Comparator} from "@pallad/compare";
import {enchant} from "./enchant";

export type Enchanted<T extends NonNullable<{}>> = Readonly<Range<T>> & Enchanted.Shape<T>;

const TYPE_CHECK = new TypeCheck('@pallad/range/enchanted');
export namespace Enchanted {
    export function is<T extends NonNullable<{}>>(value: unknown): value is Shape<T> {
        return TYPE_CHECK.isType(value);
    }

    export class Shape<T extends NonNullable<{}>> extends TYPE_CHECK.clazz {
        constructor(readonly comparator?: Comparator<T>) {
            super();
        }

        /**
         * @see Range.map
         */
        map<T1, T2 = T1, T3 = T2>(mapper: Mapping<T, T1, T2, T3>): (T1 | T2 | T3) {
            return Range.map(this as unknown as Range<T>, mapper);
        }

        /**
         * @see Range.convert
         */
        convert<TNew extends NonNullable<{}>>(mapper: (value: T) => TNew, comparator?: Comparator<TNew>): Enchanted<TNew> {
            return enchant(Range.convert(this as unknown as Range<T>, mapper, comparator));
        }

        /**
         * @see Range.isWithin
         */
        isWithin(value: T, exclusive?: boolean | { start?: boolean, end?: boolean }) {
            return Range.isWithin(this as unknown as Range<T>, value, exclusive, this.comparator);
        }

        /**
         * @see Range.toTuple
         */
        toTuple() {
            return Range.toTuple(this as unknown as Range<T>);
        }
    }
}
