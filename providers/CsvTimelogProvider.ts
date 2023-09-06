import TimelogProvider from "./TimelogProvider";

import fs from "fs";
import csv from "csv-parser";

export default class CsvTimelogProvider implements TimelogProvider {
  csvFile: string;

  constructor(csvFile: string) {
    this.csvFile = csvFile;
  }

  async *getTimeEntries() {
    const detailedRowsStream = fs.createReadStream(this.csvFile).pipe(csv());
    for await (const row of detailedRowsStream) {
      yield {
        tags: row.Tags.split(","),
        startDate: row["Start date"],
        description: row.Description,
        duration: this._getDurationInSeconds(row.Duration),
      };
    }
  }

  _getDurationInSeconds(duration: string): number {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}