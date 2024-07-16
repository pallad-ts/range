import {Range} from "@src/Range";
import '@pallad/errors-dev';
import {ERRORS} from "@src/errors";
import {assert, IsExact} from "conditional-type-checks";

describe('convert', () => {
    it.each<[Range.Tuple<number>, Range.Tuple<string>]>([
        [[10], ['10s']],
        [[undefined, 100], [undefined, '100s']],
        [[0, 100], ['0s', '100s']]
    ])('mapValues %s', (tuple, expectedTuple) => {
        const range = Range.fromArray(tuple);

        const convertedRange = Range.convert(range, value => value + 's');

        expect(Range.toTuple(convertedRange))
            .toStrictEqual(expectedTuple);
    });

    it('throws an error when conversion leads to invalid range', () => {
        const range = Range.create(0, 10);

        expect(() => {
            Range.convert(range, (value) => {
                return value === 0 ? 100 : 0;
            })
        })
            .toThrowErrorWithCode(ERRORS.START_GREATER_THAN_END);
    })

    describe('using comparator', () => {
        it('helps to ensure proper comparison of mapped values', () => {
            const range = Range.create(2, 10);

            const comparator = (a: string, b: string) => parseInt(a) - parseInt(b);
            const newRange = Range.convert(range, value => value + 's', comparator);

            expect(newRange).toEqual(Range.create('2s', '10s', comparator));
        })
    });

    it('types', () => {
        const newRange = Range.convert({start: 10}, value => value + 's');
        assert<IsExact<typeof newRange, Range<string>>>(true);
    })
})
