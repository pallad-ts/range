/* eslint-disable no-null/no-null */
import {Range} from '@src/Range';
import {Validation} from 'monet';
import {assert, IsExact} from 'conditional-type-checks';

describe('fromArray', () => {
    it('fails for empty array', () => {
        const message = 'Cannot create range from empty array';
        expect(() => {
            Range.fromArray([])
        })
            .toThrowError(message);

        expect(Range.fromArray.validation([]))
            .toEqual(Validation.Fail(message));
    });

    describe('success', () => {
        it('for single element array', () => {
            expect(Range.fromArray([1]))
                .toEqual(Range.create(1));

            expect(Range.fromArray.validation([1]))
                .toEqual(Validation.Success(Range.create(1)));
        });

        it('for array with 2 elements', () => {
            expect(Range.fromArray([1, 10]))
                .toEqual(Range.create(1, 10));

            expect(Range.fromArray.validation([1, 10]))
                .toEqual(Validation.Success(Range.create(1, 10)));
        });

        it('for array with more than 2 elements', () => {
            expect(Range.fromArray([1, 10, 100]))
                .toEqual(Range.create(1, 10));

            expect(Range.fromArray.validation([1, 10, 100]))
                .toEqual(Validation.Success(Range.create(1, 10)));
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
        const rangeStartValidation = Range.fromArray.validation([10])
        assert<IsExact<typeof rangeStartValidation, Validation<string, Range.Start<number>>>>(true)

        const rangeStartWithUndefined = Range.fromArray([10, undefined])
        assert<IsExact<typeof rangeStartWithUndefined, Range.Start<number>>>(true)
        const rangeStartWithUndefinedValidation = Range.fromArray.validation([10, undefined])
        assert<IsExact<typeof rangeStartWithUndefinedValidation, Validation<string, Range.Start<number>>>>(true)

        const rangeStartWithNull = Range.fromArray([10, null])
        assert<IsExact<typeof rangeStartWithNull, Range.Start<number>>>(true);
        const rangeStartWithNullValidation = Range.fromArray.validation([10, null])
        assert<IsExact<typeof rangeStartWithNullValidation, Validation<string, Range.Start<number>>>>(true)

        const rangeEnd = Range.fromArray([undefined, 10])
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true)
        const rangeEndValidation = Range.fromArray.validation([undefined, 10])
        assert<IsExact<typeof rangeEndValidation, Validation<string, Range.End<number>>>>(true)

        const rangeEndWithNull = Range.fromArray([null, 10]);
        assert<IsExact<typeof rangeEndWithNull, Range.End<number>>>(true);
        const rangeEndWithNullValidation = Range.fromArray.validation([null, 10]);
        assert<IsExact<typeof rangeEndWithNullValidation, Validation<string, Range.End<number>>>>(true);

        const rangeFull = Range.fromArray([0, 10]);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true)
        const rangeFullValidation = Range.fromArray.validation([0, 10]);
        assert<IsExact<typeof rangeFullValidation, Validation<string, Range.Full<number>>>>(true);
    });
})
