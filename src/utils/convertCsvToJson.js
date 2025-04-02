import fs from "fs";
import Papa from "papaparse";

const fileName = "fraud_data";  
const csvFilePath = `src/csv/${fileName}.csv`;
const jsonFilePath = `src/json/${fileName}.json`;

const readStream = fs.createReadStream(csvFilePath, "utf8");
const writeStream = fs.createWriteStream(jsonFilePath);

let rowCount = 0;
const maxRows = 100000;
const results = [];
let parsingStopped = false; 

Papa.parse(readStream, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  step: (result, parser) => {
    if (rowCount < maxRows) {
      results.push(result.data);
      rowCount++;
    }

    if (rowCount === maxRows && !parsingStopped) {
      parsingStopped = true; 
      console.log(`Processed ${maxRows} rows. Stopping further parsing.`);
      parser.abort(); 
      readStream.close(); 
    }
  },
  complete: () => {
    if (parsingStopped) {
      console.log(`Writing ${maxRows} rows to JSON file...`);
      fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
        if (err) {
          console.error(`Error writing ${fileName}.json:`, err);
        } else {
          console.log(`JSON file created at: ${jsonFilePath} with ${maxRows} rows`);
        }
      });
    }
  },
  error: (err) => {
    console.error(` Error parsing CSV:`, err);
  }
});
