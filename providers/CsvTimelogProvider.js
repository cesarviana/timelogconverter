const fs = require("fs");
const csv = require("csv-parser");

const TimelogProvider = require("./TimelogProvider");

class CsvTimelogProvider extends TimelogProvider {
  constructor(csvFile) {
    super(...arguments);
    this.csvFile = csvFile;
  }
  async *getTimeEntries() {
    const detailedRowsStream = fs.createReadStream(this.csvFile).pipe(csv());
    for await (const row of detailedRowsStream) {
      yield {
        tags: row.Tags.split(','),
        startDate: row["Start date"],
        description: row.Description,
        duration: this._getDurationInSeconds(row.Duration),
      };
    }
  }
  
  _getDurationInSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}


module.exports = CsvTimelogProvider;
