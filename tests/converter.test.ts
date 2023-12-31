import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const { expect } = chai;

import { createArrayCsvWriter as createCsvWriter } from "csv-writer";
import { CsvWriter } from "csv-writer/src/lib/csv-writer";

const fs = require("fs").promises;

import { convertCSV, convertToggl } from "../converter";

describe("test conversion", () => {
  describe("toggl", () => {
    it("converts data from toggl", async () => {
      const outputData = await convertToggl(new Date());
      expect(outputData).to.be.an("array");
    });
  });

  describe("csv", () => {
    const TEST_FILE: string = "toggl_test.csv";

    let csvWriter: CsvWriter<string[]>;

    async function writeRecords(records: string[][]) {
      await csvWriter.writeRecords(records);
    }
    beforeEach(async () => {
      await fs.writeFile(TEST_FILE, "");
      csvWriter = createCsvWriter({
        header: ["Description", "Start date", "Duration", "Tags"],
        path: TEST_FILE,
      });
    });

    it("converts correctly", async () => {
      await writeRecords([
        [
          "#38955 - Git Work",
          "2023-08-28",
          "00:15:44",
          "Chore, Questionnaires",
        ],
      ]);
      const outputData = await convertCSV(TEST_FILE);
      expect(outputData).to.be.an("array");
      expect(outputData).to.have.lengthOf(1);
      const row = outputData[0];
      expect(row.month).to.be.equal("2023-08");
      expect(row.quarter).to.be.equal("2023-3");
      expect(row.week).to.be.equal("2023-35");
      expect(row.storyId).to.be.equal("38955");
      expect(row.storyTitle).to.be.equal("Git Work");
      expect(row.type).to.be.equal("chore");
      expect(row.duration, "Hours in decimal").to.be.equal("0.25");
    });

    it("sums duration", async () => {
      await writeRecords([
        [
          "#38955 - Git Work",
          "2023-08-28",
          "00:15:00",
          "Chore, Questionnaires",
        ],
        [
          "#38955 - Git Work",
          "2023-08-28",
          "00:45:00",
          "Chore, Questionnaires",
        ],
      ]);
      const outputData = await convertCSV(TEST_FILE);
      const row = outputData[0];
      expect(row.duration, "Sum duration").to.be.equal("1.00");
    });

    it("uses available type even if tags are empty for some entry", async () => {
      await writeRecords([
        [
          "#38955 - Git Work",
          "2023-08-28",
          "00:15:00",
          "Chore, Questionnaires",
        ],
        ["#38955 - Git Work", "2023-08-28", "00:45:00", ""],
      ]);
      const outputData = await convertCSV(TEST_FILE);
      const row = outputData[0];
      expect(row.type).to.equal("chore");
    });

    it("outputs ### Missing type ### if all entries are empty in tag column", async () => {
      await writeRecords([
        ["#38955 - Git Work", "2023-08-28", "00:15:00", ""],
        ["#38955 - Git Work", "2023-08-28", "00:45:00", ""],
      ]);
      const outputData = await convertCSV(TEST_FILE);
      const row = outputData[0];
      expect(row.type).to.equal("### Missing type ###");
    });
  });
});
