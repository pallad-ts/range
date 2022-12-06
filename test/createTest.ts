/* eslint-disable no-null/no-null */
import {Range} from "@src/Range";
import {assert, IsExact} from 'conditional-type-checks';
import {A_VALUE, B_VALUE} from "./fixtures";
import * as sinon from 'sinon';

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
                .toStrictEqual({end: 10});

            expect(Range.create(null, 10))
                .toStrictEqual({end: 10});
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
    });

    it('fails if `start` is greater than `end`', () => {
        const message = '"start" cannot be greater than "end"';
        expect(() => {
            Range.create(100, 1)
        })
            .toThrowError(message);
    });

    it('fails if `start` is greater than `end` using custom comparator', () => {
        const message = '"start" cannot be greater than "end"';
        const comparator = sinon.stub().callsFake((a, b) => a.value - b.value)

        expect(() => {
            Range.create(B_VALUE, A_VALUE, comparator)
        })
            .toThrowError(message)
    });

    it('types', () => {
        const rangeStart = Range.create(10);
        assert<IsExact<typeof rangeStart, Range.Start<number>>>(true);

        const rangeEnd = Range.create(undefined, 10);
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true);

        const rangeFull = Range.create(0, 10);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true);
    });
});
