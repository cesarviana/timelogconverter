const { convertCSV } = require("./converter");

const inputFileName = process.argv[2];
convertCSV(inputFileName);