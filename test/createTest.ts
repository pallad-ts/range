/* eslint-disable no-null/no-null */
import {Range} from "@src/Range";
import {assert, IsExact} from 'conditional-type-checks';
import {Either, left, right} from "@sweet-monads/either";

describe('create', () => {
    describe('success', () => {
        it('full', () => {
            expect(Range.create(1, 10))
                .toStrictEqual({start: 1, end: 10});

            expect(Range.create.either(1, 10))
                .toStrictEqual(right({start: 1, end: 10}));
        });

        it('start', () => {
            expect(Range.create(1))
                .toStrictEqual({start: 1});
            expect(Range.create.either(1))
                .toStrictEqual(right({start: 1}));

            expect(Range.create(1, null))
                .toStrictEqual({start: 1});
            expect(Range.create.either(1, null))
                .toStrictEqual(right({start: 1}));

            expect(Range.create(1, undefined))
                .toStrictEqual({start: 1});
            expect(Range.create.either(1, undefined))
                .toStrictEqual(right({start: 1}));
        });

        it('end', () => {
            expect(Range.create(undefined, 10))
                .toStrictEqual({end: 10});
            expect(Range.create.either(undefined, 10))
                .toStrictEqual(right({end: 10}));

            expect(Range.create(null, 10))
                .toStrictEqual({end: 10});
            expect(Range.create.either(null, 10))
                .toStrictEqual(right({end: 10}));
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

        const message = 'Cannot create Range from undefined or null values';
        expect(() => {
            // @ts-ignore
            Range.create(...args)
        })
            .toThrowError(message);

        // @ts-ignore
        expect(Range.create.either(...args))
            .toEqual(left(message));
    });

    it('fails if `start` is greater than `end`', () => {
        const message = '"start" cannot be greater than "end"';
        expect(() => {
            Range.create(100, 1)
        })
            .toThrowError(message);

        expect(Range.create.either(100, 1))
            .toEqual(left(message));
    });

    it('types', () => {
        const rangeStart = Range.create(10);
        assert<IsExact<typeof rangeStart, Range.Start<number>>>(true);

        const rangeStartValidation = Range.create.either(10);
        assert<IsExact<typeof rangeStartValidation, Either<string, Range.Start<number>>>>(true);

        const rangeEnd = Range.create(undefined, 10);
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true);

        const rangeEndValidation = Range.create.either(undefined, 10);
        assert<IsExact<typeof rangeEndValidation, Either<string, Range.End<number>>>>(true);

        const rangeFull = Range.create(0, 10);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true);

        const rangeFullValidation = Range.create.either(0, 10);
        assert<IsExact<typeof rangeFullValidation, Either<string, Range.Full<number>>>>(true);
    });
});
