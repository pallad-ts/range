import {Range} from '@src/Range';
import {enchant} from '@src/enchant';

describe('Enchanted', () => {

    it.each<['start' | 'end' | 'full', Range.Tuple<number>]>([
        ['start', [10]],
        ['end', [undefined, 10]],
        ['full', [0, 100]]
    ])('mapping %s', (expected, tuple) => {
        expect(enchant(Range.fromArray(tuple)).map({
            start: 'start',
            end: 'end',
            full: 'full'
        }))
            .toBe(expected);
    });

    it.each<[Range.Tuple<number>, boolean]>([
        [[101], false],
        [[100], true],
        [[undefined, 10], false],
        [[undefined, 100], true],
        [[0, 10], false],
        [[0, 100], true]
    ])('isWithin range %s', (tuple, expected) => {
        const enchanted = enchant(Range.fromArray(tuple));
        expect(enchanted.isWithin(100))
            .toBe(expected);
    });

    it.each<[Range.Tuple<number>]>([
        [[10]],
        [[undefined, 100]],
        [[0, 100]]
    ])('toTuple %s', tuple => {
        const enchanted = enchant(Range.fromArray(tuple));
        expect(enchanted.toTuple())
            .toStrictEqual(tuple);
    });
})
