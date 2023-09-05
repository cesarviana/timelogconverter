const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear");
const CsvTimelogProvider = require("./providers/CsvTimelogProvider");
const TogglWeekTimelogProvider = require("./providers/TogglWeekTimelogProvider");
dayjs.extend(weekOfYear);
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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

async function convertCSV(inputFileName) {
  console.log("Reading " + inputFileName);
  const csvTimelogProvider = new CsvTimelogProvider(inputFileName);
  const timelogData = await _summarizeDetailedDataToWeekTimelog(
    csvTimelogProvider.getTimeEntries()
  );
  _writeData(timelogData);
  return timelogData;
}

async function convertToggl() {
  const togglWeekTimelogProvider = new TogglWeekTimelogProvider();
  const timelogData = await _summarizeDetailedDataToWeekTimelog(
    togglWeekTimelogProvider.getTimeEntries()
  );
  _writeData(timelogData);
  return timelogData;
}

async function _summarizeDetailedDataToWeekTimelog(rowsStream) {
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
        story.type = tags.match(pattern)[0];
      }
    }
  }
  const outputData = Array.from(storiesMap.values()).map((entry) => ({
    ...entry,
    duration: _formatDuration(entry.duration),
  }));
  return outputData;
}

function _formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const decimalMinutes = (minutes / 60).toFixed(2).replace("0.", "");
  return `${hours}.${decimalMinutes}`;
}

function _writeData(timelogData) {
  const headerRow = HEADER.map(({ title }) => title).join(",");
  console.log(headerRow);
  timelogData.forEach((row) => {
    const stringRow = HEADER.map(({ id }) => row[id]).join(",");
    console.log(stringRow);
  });
}

module.exports = {
  convertCSV,
  convertToggl,
};
