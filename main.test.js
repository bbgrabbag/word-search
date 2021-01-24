const { traverser, createMatcher, wordSearch } = require("./main.js");
const grids = require("./test-cases/grids.json");

describe("Word Search", () => {
  describe("Traversing", () => {
    const searchSpace = ["0123", "1123", "2223", "3333"];
    const traverse = traverser(searchSpace);

    it("Should return specified row", () => {
      searchSpace.forEach((row, i) => {
        expect(traverse("row", i, 0)).toEqual([
          row,
          row.split("").reverse().join(""),
        ]);
      });

      expect(traverse("row", 0, 4)).toEqual(["", ""]);
      expect(traverse("row", 4, 0)).toEqual(["", ""]);
      expect(traverse("row", 4, 4)).toEqual(["", ""]);
    });

    it("Should return specified column", () => {
      expect(traverse("column", 0, 0)).toEqual(["0123", "3210"]);
      expect(traverse("column", 1, 0)).toEqual(["123", "321"]);
      expect(traverse("column", 1, 1)).toEqual(["123", "321"]);
      expect(traverse("column", 1, 2)).toEqual(["223", "322"]);
      expect(traverse("column", 0, 1)).toEqual(["1123", "3211"]);
      expect(traverse("column", 0, 2)).toEqual(["2223", "3222"]);
      expect(traverse("column", 0, 3)).toEqual(["3333", "3333"]);

      expect(traverse("column", 0, 4)).toEqual(["", ""]);
      expect(traverse("column", 4, 0)).toEqual(["", ""]);
      expect(traverse("column", 4, 4)).toEqual(["", ""]);
    });

    it("Should return specified diagonal", () => {
      expect(traverse("positive")).toEqual(["0", "0"]);
      expect(traverse("positive", 1)).toEqual(["11", "11"]);
      expect(traverse("positive", 2)).toEqual(["212", "212"]);
      expect(traverse("positive", 3)).toEqual(["3223", "3223"]);
      expect(traverse("positive", 3, 1)).toEqual(["323", "323"]);
      expect(traverse("positive", 3, 2)).toEqual(["33", "33"]);
      expect(traverse("positive", 3, 3)).toEqual(["3", "3"]);

      expect(traverse("positive", 0, 4)).toEqual(["", ""]);
      expect(traverse("positive", 4, 0)).toEqual(["", ""]);
      expect(traverse("positive", 4, 4)).toEqual(["", ""]);

      expect(traverse("negative", 0, 3)).toEqual(["3", "3"]);
      expect(traverse("negative", 0, 2)).toEqual(["23", "32"]);
      expect(traverse("negative", 0, 1)).toEqual(["123", "321"]);
      expect(traverse("negative")).toEqual(["0123", "3210"]);
      expect(traverse("negative", 1)).toEqual(["123", "321"]);
      expect(traverse("negative", 2)).toEqual(["23", "32"]);
      expect(traverse("negative", 3)).toEqual(["3", "3"]);

      expect(traverse("negative", 0, 4)).toEqual(["", ""]);
      expect(traverse("negative", 4, 0)).toEqual(["", ""]);
      expect(traverse("negative", 4, 4)).toEqual(["", ""]);
    });
  });

  describe("Word Matcher", () => {
    it("Should match words based on regex generated from raw word", () => {
      const matcher = createMatcher("test");
      expect(matcher.test("xxxtestxxx")).toBe(true);
      expect(matcher.test("xxxtesstxxx")).toBe(false);
      expect(matcher.test("xxxtestxtestxx")).toBe(true);
    });
  });

  describe("Search function", () => {
    it("Should find nothing if search space is empty", () => {
      const results = wordSearch([])([]);
      expect(results).toEqual([]);
    });

    it("Should throw if search space is not square", () => {
      const search = wordSearch(["invalid"]);
      expect(() => search([])).toThrow(
        "Invalid grid dimensions. Search space must be size N x N"
      );
    });

    it("Should find all words in search space contained in word list", () => {
      const cases = [
        [grids.empty, ["test"], []],
        [grids["1x1"], ["a", "b", "c"], ["a"]],
        [grids["1x1"], ["not", "found"], []],
        [grids["1x1"], [], []],
        [grids["2x2"], ["it", "do"], ["it", "do"]],
        [grids["2x2"], ["not", "found"], []],
        [grids["3x3"], ["test", "none", "exists"], []],
        [
          grids["3x3"],
          ["cat", "tea", "car", "arm", "am", "arc", "me"],
          ["cat", "tea", "car", "arm", "am", "arc", "me"],
        ],
        [
          grids["10X10"],
          ["javascript", "java", "group", "notpresent"],
          ["javascript", "java", "group"],
        ],
      ];

      cases.forEach(([searchSpace, wordList, expected]) =>
        expect(wordSearch(searchSpace)(wordList)).toEqual(expected)
      );
    });
  });
});
