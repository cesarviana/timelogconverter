const { convertCSV } = require("./converter");

describe("test conversion", () => {
  it("should convert correctly", () => {
    convertCSV("toggle.csv");
  });
});
