import {Enchanted} from './Enchanted';
import {Range} from './Range';
import {Comparator} from "@pallad/compare";

export function enchant<T extends NonNullable<{}>>(range: Range<T>, comparator?: Comparator<T>): Enchanted<T> {
    if (Enchanted.is<T>(range)) {
        return range;
    }
    return Object.freeze(
        Object.assign(
            new Enchanted.Shape<T>(comparator),
            range
        )
    );
}
