import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import CsvTimelogProvider from "./providers/CsvTimelogProvider";
import TogglTimelogProvider from "./providers/TogglTimelogProvider";
import { TimeEntriesStream } from "./types/TimeEntriesStream";
dayjs.extend(weekOfYear);

const MISSING_TYPE = "### Missing type ###";
const HEADER = [
  { id: "week", title: "Week" },
  { id: "month", title: "Month" },
  { id: "quarter", title: "Quarter" },
  { id: "storyId", title: "Story ID" },
  { id: "storyTitle", title: "Story Title" },
  { id: "type", title: "Type" },
  { id: "duration", title: "Hours" },
];

type SpreadsheetRow = {
  week: string;
  month: string;
  quarter: string;
  storyId: string;
  storyTitle: string;
  type: string;
  duration: string;
  [key: string]: string;
};

export async function convertCSV(inputFileName: string) {
  console.log("Reading " + inputFileName);
  const csvTimelogProvider = new CsvTimelogProvider(inputFileName);
  const timelogData = await _summarizeDetailedDataToWeekTimelog(
    csvTimelogProvider.getTimeEntries()
  );
  _writeData(timelogData);
  return timelogData;
}

export async function convertToggl(startDate: Date) {
  const togglTimelogProvider = new TogglTimelogProvider();
  const timelogData = await _summarizeDetailedDataToWeekTimelog(
    togglTimelogProvider.getTimeEntries(startDate)
  );
  _writeData(timelogData);
  return timelogData;
}

async function _summarizeDetailedDataToWeekTimelog(
  rowsStream: TimeEntriesStream
): Promise<SpreadsheetRow[]> {
  const storiesMap = new Map();
  for await (const row of rowsStream) {
    const tags = row.tags.join(",").toLowerCase();
    const startDate = dayjs(row.startDate);

    const taskIdMatch = row.description.match(/#(\d+)/);
    if (!taskIdMatch) continue;

    const storyId = taskIdMatch[1];
    if (!storiesMap.has(storyId)) {
      const storyTitle = row.description.replace(`#${storyId} - `, "");
      const currentQuarter = Math.ceil(startDate.month() / 3);
      storiesMap.set(storyId, {
        month: startDate.format("YYYY-MM"),
        week: `${startDate.year()}-${startDate.week()}`,
        quarter: `${startDate.year()}-${currentQuarter}`,
        type: MISSING_TYPE,
        storyId,
        storyTitle,
        duration: 0,
      });
    }

    const story = storiesMap.get(storyId);
    story.duration += row.duration;

    if (story.type === MISSING_TYPE) {
      const pattern = /chore|bug|feature/;
      const typeFound = pattern.test(tags);
      if (typeFound) {
        story.type = pattern.exec(tags)?.[0];
      }
    }
  }
  const outputData = Array.from(storiesMap.values()).map((entry) => ({
    ...entry,
    duration: _formatDuration(entry.duration),
  }));
  return outputData;
}

function _formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const decimalMinutes = (minutes / 60).toFixed(2).replace("0.", "");
  return `${hours}.${decimalMinutes}`;
}

function _writeData(rows: SpreadsheetRow[]) {
  const headerRow = HEADER.map(({ title }) => title).join(",");
  console.log(headerRow);
  rows.forEach((entry) => {
    const stringRow = HEADER.map(({ id: headerId }) => entry[headerId]).join(
      ","
    );
    console.log(stringRow);
  });
}
