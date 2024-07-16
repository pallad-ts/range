import {Range} from '@src/Range';
import {enchant} from '@src/enchant';
import * as sinon from 'sinon';
import {A_VALUE, B_VALUE} from "./fixtures";

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

    it('uses custom comparator if provided', () => {
        const comparator = sinon.stub().callsFake((a, b) => a.value - b.value);

        const range = enchant(Range.fromArray([A_VALUE, B_VALUE], comparator), comparator);
        expect(range.start)
            .toBe(A_VALUE);

        sinon.assert.calledOnce(comparator);

        expect(range.isWithin({value: 100}))
            .toBe(false)

        expect(range.isWithin({value: 2}))
            .toBe(true)

        sinon.assert.callCount(comparator, 5);
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

    it.each<[Range.Tuple<number>, Range.Tuple<string>]>([
        [[10], ['10s']],
        [[undefined, 100], [undefined, '100s']],
        [[0, 100], ['0s', '100s']]
    ])('mapValues %s', (tuple, expectedTuple) => {
        const enchanted = enchant(Range.fromArray(tuple));

        expect(enchanted.convert(value => value + 's').toTuple())
            .toStrictEqual(expectedTuple);
    });
})
