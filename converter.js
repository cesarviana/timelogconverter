const fs = require("fs");
const csv = require("csv-parser");
const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

function convertCSV(inputFileName) {
  const taskMap = new Map();
  console.log("reading " + inputFileName);
  fs.createReadStream(inputFileName)
    .pipe(csv())
    .on("data", (row) => {
      const tags = row.Tags.toLowerCase();
      const startDate = dayjs(row["Start date"]);

      const taskIdMatch = row.Description.match(/#(\d+)/);
      if (!taskIdMatch) return;

      const storyId = taskIdMatch[1];
      const storyTitle = row.Description.replace(`#${storyId} - `, "");

      const pattern = /chore|bug|feature/;
      const type = pattern.exec(tags)?.[0] ?? "### Missing tag ###";
      if (type.includes("Missing")) {
        throw new Error(JSON.stringify(row) + " missing tag");
      }

      const isNewEntry = !taskMap.has(storyId);
      if (isNewEntry) {
        const currentQuarter = Math.ceil(startDate.month() / 3);
        taskMap.set(storyId, {
          month: startDate.format("YYYY-MM"),
          week: `${startDate.year()}-${startDate.week()}`,
          quarter: `${startDate.year()}-${currentQuarter}`,
          storyId,
          storyTitle,
          type,
          duration: 0,
        });
      }
      taskMap.get(storyId).duration += getDurationInSeconds(row.Duration);
    })
    .on("end", () => {
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
      csvWriter
        .writeRecords(outputData)
        .then(() => {
          console.log(
            `Conversion complete. Output written to ${outputFileName}`
          );
        })
        .catch((error) => {
          console.error("Error writing output:", error);
        });
    });
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
