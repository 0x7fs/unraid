#!/usr/bin/env node

const yargs = require("yargs/yargs");
const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const escape = require("escape-path-with-spaces");

const argv = yargs(hideBin(process.argv))
  .option("name", {
    alias: "n",
    type: "string",
    description: "The name of the TV show or movie that you want to copy",
    demandOption: true,
  })
  .option("type", {
    alias: "t",
    type: "string",
    description:
      "Whether the item provided by 'name' is a tv show or movie ('tv' or 'movie')",
    demandOption: true,
  })
  .option("destination", {
    alias: "d",
    type: "number",
    description: "The number of the disk the files should be copied to.",
    demandOption: true,
  })
  .choices("type", ["tv", "movie"]).argv;

const { name, type, destination } = argv;

const pathForDiskNumber = (diskNumber) => {
  return `/mnt/disk${diskNumber}`;
};

const checkIfFolderExists = (path) => {
  return fs.existsSync(path);
};

console.log("Determining highest disk number...");
let highestDiskNumber = 1;
while (true) {
  const path = pathForDiskNumber(highestDiskNumber);
  const exists = checkIfFolderExists(path);

  if (!exists) {
    console.log(`Disk ${highestDiskNumber--} does not exist`);
    break;
  }

  console.log(`Disk ${highestDiskNumber} exists`);

  highestDiskNumber++;
}

console.log(`Highest disk determined to be #${highestDiskNumber}\n\n`);

const shareNameFromType = (type) => {
  // These are similar now but they might not always be.
  switch (type) {
    case "tv":
      return "tv";
    case "movie":
      return "movies";
    default:
      throw new Error(`No known shares for type: ${type}`);
  }
};

const fullPathForName = (name, type, diskNumber) => {
  const diskPath = pathForDiskNumber(diskNumber);
  const share = shareNameFromType(type);

  return `${diskPath}/${share}/${name}/`;
};

const performCopy = () => {
  // rsync --remove-source-files -av --progress /mnt/disk5/tv/American\ Dad/ /mnt/disk3/tv/American\ Dad/
};

// console.log(JSON.stringify(argv, null, 2));
console.log(fullPathForName(name, type, destination));

console.log("Beginning checking disks for specified media...");

for (let diskNumber = 1; diskNumber <= highestDiskNumber; diskNumber++) {
  if (diskNumber === destination) {
    // Don't try to copy FROM the desination disk
    continue;
  }

  const path = fullPathForName(name, type, diskNumber);
  console.log(`Checking for media at: ${path}`);
  const exists = checkIfFolderExists(path);

  if (!exists) {
    console.log(`${name} does not exist on disk ${diskNumber}`);
    continue;
  }
}
