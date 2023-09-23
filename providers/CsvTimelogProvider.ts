import TimelogProvider from "./TimelogProvider";

import fs from "fs";
import csv from "csv-parser";
import dayjs from "dayjs";
import { MIN_DATE } from "../constants";

export default class CsvTimelogProvider implements TimelogProvider {
  csvFile: string;

  constructor(csvFile: string) {
    this.csvFile = csvFile;
  }

  async *getTimeEntries(startDate: Date = MIN_DATE) {
    const detailedRowsStream = fs.createReadStream(this.csvFile).pipe(csv());
    for await (const row of detailedRowsStream) {
      const rowStartDate = dayjs(row["Start date"]);
      const isValidDate =
        rowStartDate.isAfter(startDate) || rowStartDate.isSame(startDate);
      if (isValidDate) {
        yield {
          tags: row.Tags.split(","),
          startDate: row["Start date"],
          description: row.Description,
          duration: this._getDurationInSeconds(row.Duration),
        };
      }
    }
  }

  _getDurationInSeconds(duration: string): number {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}
