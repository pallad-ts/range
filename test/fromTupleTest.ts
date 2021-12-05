import {Range} from '@src/Range';

describe('fromTuple', () => {
    it('single tuple', () => {
        expect(Range.fromTuple([1]))
            .toEqual(Range.create(1));
    });

    it('tuple with 2 elements', () => {
        expect(Range.fromTuple([1, 4]))
            .toEqual(Range.create(1, 4));
    });
});
