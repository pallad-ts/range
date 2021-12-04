import {Range} from "@src/Range";
import {map} from "@src/map";

describe('map', () => {
    const full: Range.Full<number> = {start: 1, end: 100};
    const start: Range.Start<number> = {start: 1};
    const end: Range.End<number> = {end: 100};

    type ResultType = 'full' | 'start' | 'end';
    describe.each<[string, map.Mapper<number, ResultType>]>([
        [
            'functions',
            {
                end: 'end',
                start: 'start',
                full: 'full'
            }
        ],
        [
            'simple values',
            {
                end: () => 'end' as const,
                start: () => 'start' as const,
                full: () => 'full' as const
            }
        ]
    ])('mapping: %s', (_, mapper) => {
        it.each<[Range<any>, ResultType]>([
            [full, 'full'],
            [start, 'start'],
            [end, 'end']
        ])('range: %% %s', (range, expected) => {
            expect(map(range, mapper))
                .toEqual(expected);
        });
    });
});