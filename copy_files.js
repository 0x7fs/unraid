#!/usr/bin/env node

const yargs = require("yargs/yargs");
const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const escape = require("escape-path-with-spaces");
const exec = require("child_process").execSync;

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

const execute = async (command) => {
  await exec(command, { stdio: "inherit" });
};

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

const performMove = async (fromPath, toPath) => {
  const escapedFromPath = escape(fromPath.replace(/'/g, "'"));
  const escapedToPath = escape(toPath.replace(/'/g, "'"));

  try {
    console.log(`Starting copy from ${fromPath} to ${toPath}`);
    await execute(
      `rsync --remove-source-files -av --progress ${escapedFromPath} ${escapedToPath}`
    );

    console.log(`Deleting old files from ${fromPath}`);

    await execute(`rm -rf ${escapedFromPath}`);
  } catch (error) {
    console.log(
      `!!! Failed to move files from ${fromPath} to ${toPath}. Bailing!`
    );
    throw error;
  }
};

console.log("Beginning checking disks for specified media...");
const destinationPath = fullPathForName(name, type, destination);

const run = async () => {
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

    await performMove(path, destinationPath);
  }
};

run();
