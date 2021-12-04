import {isWithin} from "@src/isWithin";
import {Range} from "@src/Range";

describe('isWithin', () => {
    describe('start range', () => {
        const range: Range.Start<number> = {start: 10};

        it('satisfied', () => {
            expect(isWithin(range, ))
        });
    });
});