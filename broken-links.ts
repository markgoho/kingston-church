import { HtmlUrlChecker } from "broken-link-checker";

const htmlUrlChecker = new HtmlUrlChecker({}, {
  html: (_tree, _robots) => {},
  junk: (_result) => {},
  link: (_result) => {},
  page: (_error, _pageUrl, _customData) => {},
  end: () => {},
});

htmlUrlChecker.enqueue("http://localhost:1313", {});
