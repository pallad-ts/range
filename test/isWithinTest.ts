import {Range} from '@src/Range';

describe('isWithin', () => {
    it.each<[Range.Tuple<number>, boolean]>([
        [[10], true],
        [[200], false],
        [[undefined, 200], true],
        [[undefined, 10], false],
        [[0, 200], true],
        [[0, 10], false],
    ])('simple check of range %s for value 100 should be %s', (tuple, expected) => {
        expect(
            Range.isWithin(
                Range.fromArray(tuple),
                100
            )
        )
            .toBe(expected);
    });

    it('performs inclusive check by default', () => {
        expect(Range.isWithin(Range.create(0, 100), 0)).toBe(true);
        expect(Range.isWithin(Range.create(1, 100), 0)).toBe(false);
        expect(Range.isWithin(Range.create(0, 100), 100)).toBe(true);
        expect(Range.isWithin(Range.create(0, 99), 100)).toBe(false);
    });

    it.each<[
            boolean | { start?: boolean, end?: boolean },
        Range.Tuple<number>,
        boolean
    ]>([
        [false, [0, 100], true],
        [false, [undefined, 100], true],
        [false, [100, undefined], true],
        [true, [0, 100], false],
        [true, [undefined, 100], false],
        [true, [100, undefined], false],
        [{start: false}, [100, 1000], true],
        [{start: false}, [100, undefined], true],
        [{start: true}, [100, 1000], false],
        [{start: true}, [100, undefined], false],
        [{end: false}, [0, 100], true],
        [{end: false}, [undefined, 100], true],
        [{end: true}, [0, 100], false],
        [{end: true}, [undefined, 100], false],
        [{start: true, end: true}, [100, 1000], false],
        [{start: false, end: true}, [100, 1000], true],
        [{start: true, end: true}, [0, 100], false],
        [{start: true, end: false}, [0, 100], true],
    ])('exclusivity %s for range %s of value 100 should be %s', (exclusivity, tuple, expected) => {
        expect(
            Range.isWithin(
                Range.fromArray(tuple),
                100,
                exclusivity
            )
        )
            .toBe(expected);
    })
});
