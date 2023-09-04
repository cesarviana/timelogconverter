const { TimelogProvider } = require("./TimelogProvider");
const Toggl = require("./Toggl");

class TogglWeekTimelogProvider extends TimelogProvider {
  async *getTimeEntries() {
    const toggl = Toggl.instance();
    const toggleWeekEntries = await toggl.getWeekEntries();
    for (const togglEntry of toggleWeekEntries) {
      yield {
        tags: togglEntry.tags,
        startDate: togglEntry.start_date,
        duration: togglEntry.duration,
        description: toggl.description,
      };
    }
  }
}

module.exports = TogglWeekTimelogProvider;
