import {Enchanted} from './Enchanted';
import {Range} from './Range';

export function enchant<T extends NonNullable<{}>>(range: Range<T>): Enchanted<T> {
    if (Enchanted.is<T>(range)) {
        return range;
    }
    return Object.freeze(
        Object.assign(
            new Enchanted.Shape<T>(),
            range
        )
    );
}
