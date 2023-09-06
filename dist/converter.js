"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToggl = exports.convertCSV = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const CsvTimelogProvider_1 = __importDefault(require("./providers/CsvTimelogProvider"));
const TogglWeekTimelogProvider_1 = __importDefault(require("./providers/TogglWeekTimelogProvider"));
dayjs_1.default.extend(weekOfYear_1.default);
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
function convertCSV(inputFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reading " + inputFileName);
        const csvTimelogProvider = new CsvTimelogProvider_1.default(inputFileName);
        const timelogData = yield _summarizeDetailedDataToWeekTimelog(csvTimelogProvider.getTimeEntries());
        _writeData(timelogData);
        return timelogData;
    });
}
exports.convertCSV = convertCSV;
function convertToggl() {
    return __awaiter(this, void 0, void 0, function* () {
        const togglWeekTimelogProvider = new TogglWeekTimelogProvider_1.default();
        const timelogData = yield _summarizeDetailedDataToWeekTimelog(togglWeekTimelogProvider.getTimeEntries());
        _writeData(timelogData);
        return timelogData;
    });
}
exports.convertToggl = convertToggl;
function _summarizeDetailedDataToWeekTimelog(rowsStream) {
    var _a, rowsStream_1, rowsStream_1_1;
    var _b, e_1, _c, _d;
    var _e;
    return __awaiter(this, void 0, void 0, function* () {
        const storiesMap = new Map();
        try {
            for (_a = true, rowsStream_1 = __asyncValues(rowsStream); rowsStream_1_1 = yield rowsStream_1.next(), _b = rowsStream_1_1.done, !_b; _a = true) {
                _d = rowsStream_1_1.value;
                _a = false;
                const row = _d;
                const tags = row.tags.join(",").toLowerCase();
                const startDate = (0, dayjs_1.default)(row.startDate);
                const taskIdMatch = row.description.match(/#(\d+)/);
                if (!taskIdMatch)
                    continue;
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
                        story.type = (_e = pattern.exec(tags)) === null || _e === void 0 ? void 0 : _e[0];
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = rowsStream_1.return)) yield _c.call(rowsStream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const outputData = Array.from(storiesMap.values()).map((entry) => (Object.assign(Object.assign({}, entry), { duration: _formatDuration(entry.duration) })));
        return outputData;
    });
}
function _formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const decimalMinutes = (minutes / 60).toFixed(2).replace("0.", "");
    return `${hours}.${decimalMinutes}`;
}
function _writeData(rows) {
    const headerRow = HEADER.map(({ title }) => title).join(",");
    console.log(headerRow);
    rows.forEach((entry) => {
        const stringRow = HEADER.map(({ id: headerId }) => entry[headerId]).join(",");
        console.log(stringRow);
    });
}
