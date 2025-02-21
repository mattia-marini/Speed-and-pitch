const modifyHeaders = (details) => {
  let headers = details.responseHeaders;
  headers.push({ name: "Access-Control-Allow-Origin", value: "*" });
  headers.push({
    name: "Access-Control-Allow-Methods",
    value: "GET, POST, PUT, DELETE, OPTIONS",
  });
  headers.push({ name: "Access-Control-Allow-Headers", value: "*" });
  console.log(details);
  return { responseHeaders: headers };
};

const filter = { urls: ["<all_urls>"] };
const extraInfoSpec = ["blocking", "responseHeaders"];

if (typeof browser !== "undefined") {
  console.log(browser);
  browser.webRequest.onHeadersReceived.addListener(
    modifyHeaders,
    filter,
    extraInfoSpec,
  );
} else if (typeof chrome !== "undefined") {
  console.log(chrome);
  chrome.webRequest.onHeadersReceived.addListener(
    modifyHeaders,
    filter,
    extraInfoSpec,
  );
}
