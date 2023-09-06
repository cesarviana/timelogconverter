import { TimeEntriesStream } from "../types/TimeEntriesStream";
import { Tag } from "../types/Toggl";
import TimelogProvider from "./TimelogProvider";
import Toggl from "./Toggl";

export default class TogglWeekTimelogProvider implements TimelogProvider {
  async *getTimeEntries(): TimeEntriesStream {
    const toggl = Toggl.instance();

    const tags = await toggl.getTags();

    const toggleWeekEntries = await toggl.getWeekEntries();
    for (const togglEntry of toggleWeekEntries) {
      yield {
        tags: this._getTagNames(tags, togglEntry.tag_ids),
        startDate: togglEntry.time_entries[0].start,
        duration: togglEntry.time_entries[0].seconds,
        description: togglEntry.description,
      };
    }
  }

  _getTagNames(
    tags: Tag[],
    tag_ids: number[]
  ): string[] {
    return tag_ids
      .map((id) => tags.find(({ id: tagId }) => id === tagId))
      .filter((tag) => !!tag)
      .map((tag) => tag?.name ?? "");
  }
}

module.exports = TogglWeekTimelogProvider;
