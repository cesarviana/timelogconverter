const fs = require("fs");
const csv = require("csv-parser");

const { TimelogProvider } = require("./TimelogProvider");

class CsvTimelogProvider extends TimelogProvider {
  constructor(csvFile) {
    super(...arguments);
    this.csvFile = csvFile;
  }
  async *getTimeEntries() {
    const detailedRowsStream = fs.createReadStream(this.csvFile).pipe(csv());
    for await (const row of detailedRowsStream) {
      yield {
        tags: row.Tags,
        startDate: row["Start date"],
        description: row.Description,
        duration: row.Duration,
      };
    }
  }
}

module.exports = CsvTimelogProvider;
