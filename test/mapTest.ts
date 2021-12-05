import {Range} from "@src/Range";
import {Mapping} from '@src/Mapping';

describe('map', () => {
    const full: Range.Full<number> = {start: 1, end: 100};
    const start: Range.Start<number> = {start: 1};
    const end: Range.End<number> = {end: 100};

    type ResultType = 'full' | 'start' | 'end';
    describe.each<[string, Mapping<number, ResultType>]>([
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
            expect(Range.map(range, mapper))
                .toEqual(expected);
        });
    });
});
