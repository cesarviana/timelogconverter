const TimelogProvider = require("./TimelogProvider");
const Toggl = require("./Toggl");

class TogglWeekTimelogProvider extends TimelogProvider {
  async *getTimeEntries() {
    const toggl = Toggl.instance();

    const tags = await toggl.getTags();

    const toggleWeekEntries = await toggl.getWeekEntries();
    for (const data of toggleWeekEntries) {
      yield {
        tags: this._getTagNames(tags, data.tag_ids),
        startDate: data.time_entries[0].start,
        duration: data.time_entries[0].seconds,
        description: data.description,
      };
    }
  }

  _getTagNames(tags, tag_ids) {
    return tag_ids
      .map((id) => tags.find(({ id: tagId }) => id === tagId))
      .filter((tag) => !!tag)
      .map((tag) => tag.name);
  }
}

module.exports = TogglWeekTimelogProvider;
