/* eslint-disable no-null/no-null */
import {Range} from "@src/Range";
import {Validation} from 'monet';
import {assert, IsExact} from 'conditional-type-checks';

describe('create', () => {
    describe('success', () => {
        it('full', () => {
            expect(Range.create(1, 10))
                .toStrictEqual({start: 1, end: 10});

            expect(Range.create.validation(1, 10))
                .toStrictEqual(Validation.Success({start: 1, end: 10}));
        });

        it('start', () => {
            expect(Range.create(1))
                .toStrictEqual({start: 1});
            expect(Range.create.validation(1))
                .toStrictEqual(Validation.Success({start: 1}));

            expect(Range.create(1, null))
                .toStrictEqual({start: 1});
            expect(Range.create.validation(1, null))
                .toStrictEqual(Validation.Success({start: 1}));

            expect(Range.create(1, undefined))
                .toStrictEqual({start: 1});
            expect(Range.create.validation(1, undefined))
                .toStrictEqual(Validation.Success({start: 1}));
        });

        it('end', () => {
            expect(Range.create(undefined, 10))
                .toStrictEqual({end: 10});
            expect(Range.create.validation(undefined, 10))
                .toStrictEqual(Validation.Success({end: 10}));

            expect(Range.create(null, 10))
                .toStrictEqual({end: 10});
            expect(Range.create.validation(null, 10))
                .toStrictEqual(Validation.Success({end: 10}));
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
        expect(Range.create.validation(...args))
            .toEqual(Validation.Fail(message));
    });

    it('fails if `start` is greater than `end`', () => {
        const message = '"start" cannot be greater than "end"';
        expect(() => {
            Range.create(100, 1)
        })
            .toThrowError(message);

        expect(Range.create.validation(100, 1))
            .toEqual(Validation.Fail(message));
    });

    it('types', () => {
        const rangeStart = Range.create(10);
        assert<IsExact<typeof rangeStart, Range.Start<number>>>(true);

        const rangeStartValidation = Range.create.validation(10);
        assert<IsExact<typeof rangeStartValidation, Validation<string, Range.Start<number>>>>(true);

        const rangeEnd = Range.create(undefined, 10);
        assert<IsExact<typeof rangeEnd, Range.End<number>>>(true);

        const rangeEndValidation = Range.create.validation(undefined, 10);
        assert<IsExact<typeof rangeEndValidation, Validation<string, Range.End<number>>>>(true);

        const rangeFull = Range.create(0, 10);
        assert<IsExact<typeof rangeFull, Range.Full<number>>>(true);

        const rangeFullValidation = Range.create.validation(0, 10);
        assert<IsExact<typeof rangeFullValidation, Validation<string, Range.Full<number>>>>(true);
    });
});
