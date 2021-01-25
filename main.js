/**
 * @description Return closure produces an array containing the forward/reverse versions of the column/row/diagonal specified from starting point (row, col)
 * @param {string[]} searchSpace
 * @returns {Function}
 */
const traverser = (searchSpace) => (type = "row", row = 0, col = 0) => {
  let forward = "";
  let reverse = "";
  let rowIncrementer;
  let colIncrementer;

  /**
   * 'type' parameter represents slope/direction of line coming off starting coordinates (row/col). For example, 'positive' tracks the diagonal up-right vector, while 'negative' tracks the down-right vector. There is no need to explicitly define a 'reverse' diagonal vector because they are simply reflections of a positive or negative vector.
   */
  switch (type) {
    case "column":
      rowIncrementer = (r) => r + 1;
      colIncrementer = (c) => c;
      break;
    case "positive":
      rowIncrementer = (r) => r - 1;
      colIncrementer = (c) => c + 1;
      break;
    case "negative":
      rowIncrementer = (r) => r + 1;
      colIncrementer = (c) => c + 1;
      break;
    default:
      rowIncrementer = (r) => r;
      colIncrementer = (c) => c + 1;
  }

  const limiter = (r, c) =>
    searchSpace[r] !== undefined && searchSpace[r][c] !== undefined;

  for (
    let r = row, c = col;
    limiter(r, c);
    r = rowIncrementer(r), c = colIncrementer(c)
  ) {
    // optimize by generating forward and reverse version of the vector in one iteration
    forward += searchSpace[r][c];
    reverse = searchSpace[r][c] + reverse;
  }

  return [forward, reverse];
};

const wordSearch = (searchSpace) => (wordList) => {
  const foundWords = new Set();
  if (!searchSpace.length) return [];
  if (searchSpace.length !== searchSpace[0].length)
    throw "Invalid grid dimensions. Search space must be size N x N";

  const traverse = traverser(searchSpace);
  const last = searchSpace.length - 1;

  const candidates = [];

  for (let i = 0; i < searchSpace.length; i++) {
    candidates.push(
      ...traverse("row", i),
      ...traverse("column", 0, i),
      ...traverse("negative", 0, i),
      ...traverse("negative", i),
      ...traverse("positive", last, i),
      ...traverse("positive", i)
    );
  }

  wordList.forEach((w, i) =>
    candidates.some((c) => new RegExp(w).test(c) && foundWords.add(wordList[i]))
  );

  return Array.from(foundWords);
};

module.exports = {
  wordSearch,
  traverser,
};
