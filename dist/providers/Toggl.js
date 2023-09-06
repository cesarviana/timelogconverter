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
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
class Toggl {
    static instance() {
        return new Toggl();
    }
    constructor() {
        var _a, _b;
        this.workspaceId = parseInt((_a = process.env.TOGGL_WORKSPACE_ID) !== null && _a !== void 0 ? _a : "", 10);
        this.userId = parseInt((_b = process.env.TOGGL_USER_ID) !== null && _b !== void 0 ? _b : "", 10);
        const apiToken = btoa(`${process.env.TOGGL_API_KEY}:api_token`);
        this.axiosInstance = axios_1.default.create({
            baseURL: "https://api.track.toggl.com/",
            headers: {
                Authorization: `Basic ${apiToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    getWeekEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            const end_date = (0, dayjs_1.default)().endOf("week").format("YYYY-MM-DD");
            const start_date = (0, dayjs_1.default)().startOf("week").format("YYYY-MM-DD");
            const response = yield this.axiosInstance.post(`reports/api/v3/workspace/${this.workspaceId}/search/time_entries`, {
                // client_ids: ["integer"],
                start_date,
                end_date,
                user_ids: [this.userId],
            });
            return response.data;
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/api/v9/workspaces/${this.workspaceId}/tags`);
            return response.data;
        });
    }
}
exports.default = Toggl;
