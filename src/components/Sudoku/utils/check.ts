interface IChecker {
  isComplete: () => boolean
  isRulePass: () => boolean
}

class SquareChecker implements IChecker {
  value: (number | '')[][]
  constructor (value: (number | '')[][]) {
    this.value = value
  }

  isComplete () {
    for (const row of this.value) {
      for (const num of row) {
        const isEmptyCellValue = isNaN(Number(num)) || Number(num) === 0
        if (isEmptyCellValue) return false
      }
    }
    return true
  }

  isRulePass () {
    const checkArray: (number | '')[] = []
    for (const row of this.value) {
      for (const num of row) {
        const isDuplicated = checkArray.includes(num)
        if (isDuplicated) return false
        checkArray.push(num)
      }
    }
    return true
  }
}

const check = {
  square: (value: (number | '')[][]) => new SquareChecker(value),
  row: {

  }
}

export default check
