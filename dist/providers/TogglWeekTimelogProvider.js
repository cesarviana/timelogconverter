"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Toggl_1 = __importDefault(require("./Toggl"));
class TogglWeekTimelogProvider {
    getTimeEntries() {
        return __asyncGenerator(this, arguments, function* getTimeEntries_1() {
            const toggl = Toggl_1.default.instance();
            const tags = yield __await(toggl.getTags());
            const toggleWeekEntries = yield __await(toggl.getWeekEntries());
            for (const togglEntry of toggleWeekEntries) {
                yield yield __await({
                    tags: this._getTagNames(tags, togglEntry.tag_ids),
                    startDate: togglEntry.time_entries[0].start,
                    duration: togglEntry.time_entries[0].seconds,
                    description: togglEntry.description,
                });
            }
        });
    }
    _getTagNames(tags, tag_ids) {
        return tag_ids
            .map((id) => tags.find(({ id: tagId }) => id === tagId))
            .filter((tag) => !!tag)
            .map((tag) => { var _a; return (_a = tag === null || tag === void 0 ? void 0 : tag.name) !== null && _a !== void 0 ? _a : ""; });
    }
}
exports.default = TogglWeekTimelogProvider;
module.exports = TogglWeekTimelogProvider;
