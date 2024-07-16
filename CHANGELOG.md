# 3.2.0

* Added `Range.convert`
* Removed deprecated `alpha-errors` in favor of `@pallad/errors`
* `Range.create` now accepts `undefined` and `null` both for start and end

# 3.1.0

* Added support for custom comparator
* Dropped usage od monad `Either` since it was creating unnecessary dependency that not everyone was using
