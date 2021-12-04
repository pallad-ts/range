import {create} from "@src/create";

describe('create', () => {
    describe('success', () => {
        it('full', () => {
            expect(create(1, 10))
                .toStrictEqual({start: 1, end: 10});
        });

        it('start', () => {
            expect(create(1))
                .toStrictEqual({start: 1});
            expect(create(1, null))
                .toStrictEqual({start: 1});
            expect(create(1, undefined))
                .toStrictEqual({start: 1});
        });

        it('end', () => {
            expect(create(undefined, 10))
                .toStrictEqual({end: 10})
            expect(create(null, 10))
                .toStrictEqual({end: 10})
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
        expect(() => {
            // @ts-ignore
            create(...args);
        }).toThrowError('Cannot create Range from undefined or null values');
    });
});