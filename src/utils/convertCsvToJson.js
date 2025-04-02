import fs from "fs";
import Papa from "papaparse";

const fileName = "products";  


const csvFilePath = `src/csv/${fileName}.csv`;
const jsonFilePath = `src/json/${fileName}.json`;


fs.readFile(csvFilePath, "utf8", (err, data) => {
  if (err) {
    console.error(`❌ Error reading ${fileName}.csv:`, err);
    return;
  }


  const parsedData = Papa.parse(data, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  fs.writeFile(jsonFilePath, JSON.stringify(parsedData.data, null, 2), (err) => {
    if (err) {
      console.error(`❌ Error writing ${fileName}.json:`, err);
    } else {
      console.log(`✅ JSON file created at: ${jsonFilePath}`);
    }
  });
});
