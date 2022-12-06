/* eslint-disable no-null/no-null */
import {Range} from '@src/Range';
import {assert, IsExact} from 'conditional-type-checks';
import {A_VALUE, B_VALUE} from "./fixtures";
import * as sinon from 'sinon';

describe('fromArray', () => {
    it('fails for empty array', () => {
        const message = 'Cannot create range from empty array';
        expect(() => {
            Range.fromArray([])
        })
            .toThrowError(message);
    });

    it('with custom comparator', () => {
        const comparator = sinon.stub().callsFake((a, b) => a.value - b.value);
        expect(Range.fromArray([A_VALUE, B_VALUE], comparator))
            .toEqual(Range.create(A_VALUE, B_VALUE, comparator));
        sinon.assert.calledTwice(comparator);
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
    });

    it('types', () => {
        const rangeStart = Range.fromArray([10])
        assert<IsExact<typeof rangeStart, Range.Start<number>>>(true)

        const rangeStartWithUndefined = Range.fromArray([10, undefined])
        assert<IsExact<typeof rangeStartWithUndefined, Range.Start<number>>>(true)

        const rangeStartWithNull = Range.fromArray([10, null])
        assert<IsExact<typeof rangeStartWithNull, Range.Start<number>>>(true);

        const rangeEnd = Range.fromArray([undefined, 10])
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true)

        const rangeEndWithNull = Range.fromArray([null, 10]);
        assert<IsExact<typeof rangeEndWithNull, Range.End<number>>>(true);

        const rangeFull = Range.fromArray([0, 10]);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true)
    });
})
