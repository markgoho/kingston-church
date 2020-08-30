const { HtmlUrlChecker } = require("broken-link-checker");

const htmlUrlChecker = new HtmlUrlChecker()
  .on("error", (error) => {})
  .on("html", (tree, robots, response, pageURL, customData) => {})
  .on("queue", () => {})
  .on("junk", (result, customData) => {})
  .on("link", (result, customData) => {})
  .on("page", (error, pageURL, customData) => {})
  .on("end", () => {});

htmlUrlChecker.enqueue("http://localhost:1313");
