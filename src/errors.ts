import {Domain, ErrorDescriptor, formatCodeFactory} from "@pallad/errors";

const code = formatCodeFactory("E_RANGE_%c");

export const errorsDomain = new Domain();

export const ERRORS = errorsDomain.addErrorsDescriptorsMap({
    START_GREATER_THAN_END: ErrorDescriptor.useDefaultMessage(code(1), '"start" cannot be greater than "end"', TypeError),
    UNDEFINED_BOUNDARIES: ErrorDescriptor.useDefaultMessage(code(2), 'Cannot create Range from undefined or null values', TypeError),
    EMPTY_ARRAY_ARGUMENT: ErrorDescriptor.useDefaultMessage(code(3), 'Cannot create range from empty array', TypeError)
});
