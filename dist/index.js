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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const converter_1 = require("./converter");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { argv } = process;
        const parsedArgs = yield (0, yargs_1.default)((0, helpers_1.hideBin)(argv)).argv;
        if (parsedArgs['csv']) {
            (0, converter_1.convertCSV)(parsedArgs['csv']);
        }
        else {
            (0, converter_1.convertToggl)();
        }
    });
}
main();
