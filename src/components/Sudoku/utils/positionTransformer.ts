
type Position = {
  x: number
  y: number
}

const positionTransformer = {
  toGlobal: (refPosition: Position, localPosition: Position) => {
    return {
      x: localPosition.x + refPosition.x * 3,
      y: localPosition.y + refPosition.y * 3
    }
  },
  toLocal: ({ x, y }: Position) => {
    return {
      refPosition: {
        x: Math.floor(x / 3),
        y: Math.floor(y / 3)
      },
      localPosition: {
        x: x % 3,
        y: y % 3
      }
    }
  }
}

export default positionTransformer
