import {Enchanted} from './Enchanted';
import {Range} from './Range';

export function enchant<T>(range: Range<T>): Enchanted<T> {
    return Object.freeze(
        Object.assign(
            Object.create(Enchanted.Shape.prototype),
            range
        )
    );
}
