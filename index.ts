import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { convertCSV, convertToggl } from "./converter";
import dayjs from "dayjs";

async function main() {
  const { argv } = process;
  const parsedArgs = await yargs(hideBin(argv)).argv;

  if (parsedArgs["csv"]) {
    convertCSV(parsedArgs["csv"] as string);
  } else {
    const daysToSubtract = (parsedArgs["days"] as number) ?? 0;
    const startDate = dayjs().subtract(daysToSubtract, "days");
    console.log("Start date:", startDate.format("DD/MM (dddd)"));
    convertToggl(startDate.toDate());
  }
}

main();
