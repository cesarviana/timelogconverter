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
const Toggl_1 = __importDefault(require("../providers/Toggl"));
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe("test conversion", () => {
    it('gets weekly report', () => __awaiter(void 0, void 0, void 0, function* () {
        const toggl = Toggl_1.default.instance();
        const result = yield toggl.getWeekEntries();
        expect(result).to.not.be.null;
    }));
});
