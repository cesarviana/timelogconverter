import dotenv from 'dotenv';
dotenv.config();
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { convertCSV, convertToggl } from "./converter";

async function main() {
  const { argv } = process;
  const parsedArgs = await yargs(hideBin(argv)).argv;
  
  if (parsedArgs['csv']) {
    convertCSV(parsedArgs['csv'] as string);
  } else {
    convertToggl();
  }
}

main()