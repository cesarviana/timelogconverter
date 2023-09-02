const fs = require("fs");
const csv = require("csv-parser");
const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const MISSING_TYPE = "### Missing type ###";

async function convertCSV(inputFileName) {
  console.log("Reading " + inputFileName);

  const taskMap = await _readData(inputFileName);
  const outputData = await _writeData(taskMap);
  return outputData;
}

async function _readData(inputFileName) {
  const storiesMap = new Map();
  const stream = fs.createReadStream(inputFileName).pipe(csv());

  for await (const row of stream) {
    const tags = row.Tags.toLowerCase();
    const startDate = dayjs(row["Start date"]);

    const taskIdMatch = row.Description.match(/#(\d+)/);
    if (!taskIdMatch) continue;

    const storyId = taskIdMatch[1];
    if (!storiesMap.has(storyId)) {
      const storyTitle = row.Description.replace(`#${storyId} - `, "");
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
    story.duration += getDurationInSeconds(row.Duration);

    if (story.type === MISSING_TYPE) {
      const pattern = /chore|bug|feature/;
      const typeFound = pattern.test(tags);
      if (typeFound) {
        story.type = tags.match(pattern)[0];
      } else {
        const badRow = JSON.stringify(row) + " missing tag";
        console.warn(
          `Missing tags. All entries must contain "Chore", "Bug" or "Feature". \n ${badRow}`
        );
      }
    }
  }
  return storiesMap;
}

async function _writeData(taskMap) {
  const outputData = Array.from(taskMap.values()).map((entry) => ({
    ...entry,
    duration: formatDuration(entry.duration),
  }));

  const outputFileName = `output.csv`;
  const csvWriter = createCsvWriter({
    path: outputFileName,
    header: [
      { id: "week", title: "Week" },
      { id: "month", title: "Month" },
      { id: "quarter", title: "Quarter" },
      { id: "storyId", title: "Story ID" },
      { id: "storyTitle", title: "Story Title" },
      { id: "type", title: "Type" },
      { id: "duration", title: "Hours" },
    ],
  });

  await csvWriter.writeRecords(outputData);
  console.log(`Conversion complete. Output written to ${outputFileName}`);
  return outputData;
}

function getDurationInSeconds(duration) {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const decimalMinutes = (minutes / 60).toFixed(2).replace("0.", "");
  return `${hours}.${decimalMinutes}`;
}

module.exports = {
  convertCSV,
};
