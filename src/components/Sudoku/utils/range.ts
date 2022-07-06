const range = (startAt: number, size: number) => {
  return Array.from(new Array(size).keys()).map(i => i + startAt)
}

export default range
