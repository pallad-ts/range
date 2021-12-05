import {Range} from '@src/Range';

describe('fromArray', () => {
    it('fails for empty array', () => {
        expect(() => {
            Range.fromArray([]);
        }).toThrowErrorMatchingSnapshot();
    });

    describe('success', () => {
        it('for single element array', () => {
            expect(Range.fromArray([1]))
                .toEqual(Range.create(1));
        });

        it('for array with 2 elements', () => {
            expect(Range.fromArray([1, 10]))
                .toEqual(Range.create(1, 10));
        });

        it('for array with more than 2 elements', () => {
            expect(Range.fromArray([1, 10, 100]))
                .toEqual(Range.create(1, 10));
        });
    })
})
