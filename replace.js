import { replaceInFileSync } from "replace-in-file";

const options = {
  files: "./hugo/content/sermons/**/*.md",
  from: /(v1\/KingstonChurch\/)([\w\s]+)(\.mp3)/g,
  to: (...arguments_) => replaceSpacesWithUnderscores(arguments_),
};

try {
  const changes = replaceInFileSync(options);
  console.log("Modified files:", changes.join(", "));
} catch (error) {
  console.error("Error occurred:", error);
}

function replaceSpacesWithUnderscores(arguments_) {
  const [, startingPath, fileName, extension] = arguments_;

  const fixedFileName = fileName.replaceAll(/\s/g, "_");

  return `${startingPath}${fixedFileName}${extension}`;
}
