import {Domain, generators} from "alpha-errors";

export const ERRORS = Domain.create({
    codeGenerator: generators.formatCode('E_RANGE_%d')
})
    .createErrors(create => {
        return {
            START_GREATER_THAN_END: create({
                message: '"start" cannot be greater than "end"',
                errorClass: TypeError
            }),
            UNDEFINED_BOUNDARIES: create({
                message: 'Cannot create Range from undefined or null values',
                errorClass: TypeError,
            }),
            EMPTY_ARRAY_ARGUMENT: create({
                message: 'Cannot create range from empty array',
                errorClass: TypeError
            })
        }
    })
