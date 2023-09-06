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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const csv_writer_1 = require("csv-writer");
const fs = require("fs").promises;
const converter_1 = require("../converter");
describe("test conversion", () => {
    describe("toggl", () => {
        it("converts data from toggl", () => __awaiter(void 0, void 0, void 0, function* () {
            const outputData = yield (0, converter_1.convertToggl)();
            expect(outputData).to.be.an("array");
        }));
    });
    describe("csv", () => {
        const TEST_FILE = "toggl_test.csv";
        let csvWriter;
        function writeRecords(records) {
            return __awaiter(this, void 0, void 0, function* () {
                yield csvWriter.writeRecords(records);
            });
        }
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield fs.writeFile(TEST_FILE, "");
            csvWriter = (0, csv_writer_1.createArrayCsvWriter)({
                header: ["Description", "Start date", "Duration", "Tags"],
                path: TEST_FILE,
            });
        }));
        it("converts correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            yield writeRecords([
                [
                    "#38955 - Git Work",
                    "2023-08-28",
                    "00:15:44",
                    "Chore, Questionnaires",
                ],
            ]);
            const outputData = yield (0, converter_1.convertCSV)(TEST_FILE);
            expect(outputData).to.be.an("array");
            expect(outputData).to.have.lengthOf(1);
            const row = outputData[0];
            expect(row.month).to.be.equal("2023-08");
            expect(row.quarter).to.be.equal("2023-3");
            expect(row.week).to.be.equal("2023-35");
            expect(row.storyId).to.be.equal("38955");
            expect(row.storyTitle).to.be.equal("Git Work");
            expect(row.type).to.be.equal("chore");
            expect(row.duration, "Hours in decimal").to.be.equal("0.25");
        }));
        it("sums duration", () => __awaiter(void 0, void 0, void 0, function* () {
            yield writeRecords([
                [
                    "#38955 - Git Work",
                    "2023-08-28",
                    "00:15:00",
                    "Chore, Questionnaires",
                ],
                [
                    "#38955 - Git Work",
                    "2023-08-28",
                    "00:45:00",
                    "Chore, Questionnaires",
                ],
            ]);
            const outputData = yield (0, converter_1.convertCSV)(TEST_FILE);
            const row = outputData[0];
            expect(row.duration, "Sum duration").to.be.equal("1.00");
        }));
        it("uses available type even if tags are empty for some entry", () => __awaiter(void 0, void 0, void 0, function* () {
            yield writeRecords([
                [
                    "#38955 - Git Work",
                    "2023-08-28",
                    "00:15:00",
                    "Chore, Questionnaires",
                ],
                ["#38955 - Git Work", "2023-08-28", "00:45:00", ""],
            ]);
            const outputData = yield (0, converter_1.convertCSV)(TEST_FILE);
            const row = outputData[0];
            expect(row.type).to.equal("chore");
        }));
        it("outputs ### Missing type ### if all entries are empty in tag column", () => __awaiter(void 0, void 0, void 0, function* () {
            yield writeRecords([
                ["#38955 - Git Work", "2023-08-28", "00:15:00", ""],
                ["#38955 - Git Work", "2023-08-28", "00:45:00", ""],
            ]);
            const outputData = yield (0, converter_1.convertCSV)(TEST_FILE);
            const row = outputData[0];
            expect(row.type).to.equal("### Missing type ###");
        }));
    });
});
