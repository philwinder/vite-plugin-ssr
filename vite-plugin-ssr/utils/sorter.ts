import { assert } from './assert'

export { higherFirst }
export { lowerFirst }
export { makeFirst }
export { makeLast }

// -1 => element1 first (i.e. `indexOf(element1) < indexOf(element2)`)
// +1 => element2 first (i.e. `indexOf(element2) < indexOf(element1)`)
// 0 => keep original order of element1 and element2

function higherFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 > val2 ? -1 : 1
  }
}

function lowerFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 < val2 ? -1 : 1
  }
}

function makeFirst<T>(getValue: (element: T) => boolean | null): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    assert([true, false, null].includes(val1))
    assert([true, false, null].includes(val2))
    if (val1 === val2) {
      return 0
    }
    if (val1 === true || val2 === false) {
      return -1
    }
    if (val2 === true || val1 === false) {
      return 1
    }
    assert(false)
  }
}

function makeLast<T>(getValue: (element: T) => boolean | null) {
  return makeFirst((element: T) => {
    const val = getValue(element)
    if (val === null) {
      return null
    } else {
      return !val
    }
  })
}
