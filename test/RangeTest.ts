import {Range} from "@src/Range";

describe('Range', () => {
    const full: Range.Full<number> = {start: 1, end: 100};
    const start: Range.Start<number> = {start: 1};
    const end: Range.End<number> = {end: 100};

    const nonRangeCases: Array<[any]> = [
        [undefined],
        // eslint-disable-next-line no-null/no-null
        [null],
        [{}],
        [[1, 2]],
        [[]],
        ['range']
    ];

    describe('is', () => {
        it.each<[Range<any>]>([
            [full],
            [start],
            [end],
        ])('case: %j', input => {
            expect(Range.is(input))
                .toBe(true);
        });

        it.each(nonRangeCases)('fail for %j', input => {
            expect(Range.is(input))
                .toBe(false);
        });
    });

    describe('Full', () => {
        it.each<[Range<any>, boolean]>([
            [full, true],
            [start, false],
            [end, false]
        ])('case: %j - %s', (range, isSatisfied) => {
            expect(Range.Full.is(range))
                .toBe(isSatisfied);
        });

        it.each(nonRangeCases)('fail for %j', input => {
            expect(Range.Full.is(input))
                .toBe(false);
        });
    });

    describe('Start', () => {
        it.each<[Range<any>, boolean]>([
            [full, true],
            [start, true],
            [end, false]
        ])('case: %j - %s', (range, isSatisfied) => {
            expect(Range.Start.is(range))
                .toBe(isSatisfied);
        });

        it.each(nonRangeCases)('fail for %j', input => {
            expect(Range.Start.is(input))
                .toBe(false);
        });
    });

    describe('End', () => {
        it.each<[Range<any>, boolean]>([
            [full, true],
            [start, false],
            [end, true]
        ])('case: %j - %s', (range, isSatisfied) => {
            expect(Range.End.is(range))
                .toBe(isSatisfied);
        });

        it.each(nonRangeCases)('fail for %j', input => {
            expect(Range.End.is(input))
                .toBe(false);
        });
    });
});
