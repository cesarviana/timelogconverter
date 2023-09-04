const Toggl = require("./Toggl");

class TimelogProvider {
  async getTimeEntries() {
    return [];
  }
}

class TogglWeekTimelogProvider extends TimelogProvider {
  async *getTimeEntries() {
    const toggl = Toggl.instance();
    const toggleWeekEntries = await toggl.getWeekEntries();
    for (const togglEntry of toggleWeekEntries.data) {
      yield {
        tags: togglEntry.tags,
        startDate: togglEntry.start_date,
        duration: togglEntry.duration,
        description: toggl.description,
      };
    }
  }
}

class CsvTimelogProvider extends TimelogProvider {
  constructor(csvFile) {
    super(...arguments);
    this.csvFile = csvFile;
  }
  async *getTimeEntries() {
    const detailedRowsStream = fs.createReadStream(this.csv).pipe(csv());
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

module.exports = {
  TimelogProvider,
  TogglWeekTimelogProvider,
  CsvTimelogProvider
};
