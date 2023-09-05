require('dotenv').config();
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const { convertCSV, convertToggl } = require("./converter");

if (argv.csv) {
  convertCSV(argv.csv);
} else {
  convertToggl();
}
