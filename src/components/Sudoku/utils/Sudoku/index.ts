import { sudoku as _sudoku } from './Sudoku'

const SudokuCore = _sudoku as {
  generate: (num: number) => string,
  solve: (diff: any, rev?: any) => string | boolean
}

export const generater = (num: number) => {
  const puz = Array.from(SudokuCore.generate(num)).map(item => isNaN(Number(item)) ? '' : Number(item))
  return puz
}

export default SudokuCore
