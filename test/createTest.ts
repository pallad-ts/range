import {Range} from "@src/Range";

describe('create', () => {
    describe('success', () => {
        it('full', () => {
            expect(Range.create(1, 10))
                .toStrictEqual({start: 1, end: 10});
        });

        it('start', () => {
            expect(Range.create(1))
                .toStrictEqual({start: 1});
            expect(Range.create(1, null))
                .toStrictEqual({start: 1});
            expect(Range.create(1, undefined))
                .toStrictEqual({start: 1});
        });

        it('end', () => {
            expect(Range.create(undefined, 10))
                .toStrictEqual({end: 10})
            expect(Range.create(null, 10))
                .toStrictEqual({end: 10})
        });
    });

    it.each<any[]>([
        [undefined, undefined],
        [undefined, null],
        [null, undefined],
        [null, null],
        [undefined],
        [],
        [null]
    ])('failing if none values provided', (...args) => {
        expect(() => {
            // @ts-ignore
            Range.create(...args);
        }).toThrowError('Cannot create Range from undefined or null values');
    });
});
