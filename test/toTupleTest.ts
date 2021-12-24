import {Range} from '@src/Range';
import {assert, IsExact} from 'conditional-type-checks';

describe('toTuple', () => {
    it.each<[Range.Tuple<number>]>([
        [[10]],
        [[undefined, 10]],
        [[0, 10]]
    ])('from %s', tuple => {
        const range = Range.fromArray(tuple);
        expect(Range.toTuple(range))
            .toEqual(tuple);
    })

    it('types', () => {
        const rangeStartTuple = Range.toTuple({start: 10});
        assert<IsExact<typeof rangeStartTuple, [number] | [number, undefined | null]>>(true)

        const rangeEndTuple = Range.toTuple({end: 10});
        assert<IsExact<typeof rangeEndTuple, [undefined | null, number]>>(true)

        const rangeFullTuple = Range.toTuple({end: 10, start: 0});
        assert<IsExact<typeof rangeFullTuple, [number, number]>>(true)
    });
})
