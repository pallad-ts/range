/* eslint-disable no-null/no-null */
import {Range} from '@src/Range';
import {assert, IsExact} from 'conditional-type-checks';
import {Either, left, right} from "@sweet-monads/either";

describe('fromArray', () => {
    it('fails for empty array', () => {
        const message = 'Cannot create range from empty array';
        expect(() => {
            Range.fromArray([])
        })
            .toThrowError(message);

        expect(Range.fromArray.either([]))
            .toEqual(left(message));
    });

    describe('success', () => {
        it('for single element array', () => {
            expect(Range.fromArray([1]))
                .toEqual(Range.create(1));

            expect(Range.fromArray.either([1]))
                .toEqual(right(Range.create(1)));
        });

        it('for array with 2 elements', () => {
            expect(Range.fromArray([1, 10]))
                .toEqual(Range.create(1, 10));

            expect(Range.fromArray.either([1, 10]))
                .toEqual(right(Range.create(1, 10)));
        });

        it('for array with more than 2 elements', () => {
            expect(Range.fromArray([1, 10, 100]))
                .toEqual(Range.create(1, 10));

            expect(Range.fromArray.either([1, 10, 100]))
                .toEqual(right(Range.create(1, 10)));
        });

        describe('from tuple', () => {
            it('single tuple', () => {
                expect(Range.fromArray([1]))
                    .toEqual(Range.create(1));
            });

            it('tuple with 2 elements', () => {
                expect(Range.fromArray([1, 4]))
                    .toEqual(Range.create(1, 4));

                expect(Range.fromArray([1, undefined]))
                    .toEqual(Range.create(1));
            });

            it('tuple with 2 elements without start', () => {
                expect(Range.fromArray([undefined, 4]))
                    .toEqual(Range.create(undefined, 4));

                expect(Range.fromArray([null, 4]))
                    .toEqual(Range.create(null, 4));
            });
        })
    })

    it('types', () => {
        const rangeStart = Range.fromArray([10])
        assert<IsExact<typeof rangeStart, Range.Start<number>>>(true)
        const rangeStartValidation = Range.fromArray.either([10])
        assert<IsExact<typeof rangeStartValidation, Either<string, Range.Start<number>>>>(true)

        const rangeStartWithUndefined = Range.fromArray([10, undefined])
        assert<IsExact<typeof rangeStartWithUndefined, Range.Start<number>>>(true)
        const rangeStartWithUndefinedValidation = Range.fromArray.either([10, undefined])
        assert<IsExact<typeof rangeStartWithUndefinedValidation, Either<string, Range.Start<number>>>>(true)

        const rangeStartWithNull = Range.fromArray([10, null])
        assert<IsExact<typeof rangeStartWithNull, Range.Start<number>>>(true);
        const rangeStartWithNullValidation = Range.fromArray.either([10, null])
        assert<IsExact<typeof rangeStartWithNullValidation, Either<string, Range.Start<number>>>>(true)

        const rangeEnd = Range.fromArray([undefined, 10])
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true)
        const rangeEndValidation = Range.fromArray.either([undefined, 10])
        assert<IsExact<typeof rangeEndValidation, Either<string, Range.End<number>>>>(true)

        const rangeEndWithNull = Range.fromArray([null, 10]);
        assert<IsExact<typeof rangeEndWithNull, Range.End<number>>>(true);
        const rangeEndWithNullValidation = Range.fromArray.either([null, 10]);
        assert<IsExact<typeof rangeEndWithNullValidation, Either<string, Range.End<number>>>>(true);

        const rangeFull = Range.fromArray([0, 10]);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true)
        const rangeFullValidation = Range.fromArray.either([0, 10]);
        assert<IsExact<typeof rangeFullValidation, Either<string, Range.Full<number>>>>(true);
    });
})
