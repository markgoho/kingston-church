const replace = require("replace-in-file");
const options = {
  files: "./hugo/content/sermons/**/*.md",
  from: /(v1\/KingstonChurch\/)([\w\s]+)(\.mp3)/g,
  to: (...args) => replaceSpacesWithUnderscores(args),
};

try {
  const changes = replace.sync(options);
  console.log("Modified files:", changes.join(", "));
} catch (error) {
  console.error("Error occurred:", error);
}

function replaceSpacesWithUnderscores(args) {
  const [fullString, startingPath, fileName, extension] = args;

  const fixedFileName = fileName.replace(/\s/g, "_");

  return `${startingPath}${fixedFileName}${extension}`;
}
