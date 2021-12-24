import {Range} from '@src/Range';
import {enchant} from '@src/enchant';
import {Enchanted} from '@src/Enchanted';

describe('enchant', () => {
    it.each<[string, Range.Tuple<number>]>([
        ['start', [10]],
        ['end', [undefined, 10]],
        ['full', [0, 10]]
        // eslint-disable-next-line @typescript-eslint/naming-convention
    ])('enchanting range %s', (_, tuple) => {
        const inputRange = Range.fromArray(tuple);
        const enchanted = enchant(inputRange);
        expect(Enchanted.is(enchanted))
            .toBe(true);

        expect(enchanted.map)
            .toEqual(Enchanted.Shape.prototype.map);

        expect(enchanted.isWithin)
            .toEqual(Enchanted.Shape.prototype.isWithin);
    });

    it('enchanting already enchanted range does not have any effect', () => {
        const enchanted = enchant(Range.fromArray([0, 10]));

        expect(enchant(enchanted) === enchanted)
            .toBe(true);
    });
});
