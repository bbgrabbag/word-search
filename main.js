const traverser = (searchSpace) => (type = "row", row = 0, col = 0) => {
  let forward = "";
  let reverse = "";
  let rowIncrementer;
  let colIncrementer;

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

  for (let c = 0; c < searchSpace.length; c++) {
    candidates.push(
      ...traverse("column", 0, c),
      ...traverse("negative", 0, c),
      ...traverse("positive", last, c)
    );
  }

  for (let r = 0; r < searchSpace.length; r++) {
    candidates.push(
      ...traverse("row", r),
      ...traverse("negative", r),
      ...traverse("positive", r)
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
