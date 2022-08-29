import HTTPParser from "http-parser-js";

const httpParser = HTTPParser.HTTPParser;

function getParser(report) {
  const parser = new httpParser(httpParser.RESPONSE);
  let trailers = [];
  let bodyChunks = [];

  parser[httpParser.kOnHeadersComplete] = function (res) {
    const statusCodeNumber = Number(res.statusCode);

    switch (true) {
      case statusCodeNumber >= 100 && statusCodeNumber < 200: {
        report.statusCode["1xx"] += 1;
        report.totalRequest += 1;
        break;
      }

      case statusCodeNumber < 300: {
        report.statusCode["2xx"] += 1;
        report.totalRequest += 1;
        break;
      }

      case statusCodeNumber < 400: {
        report.statusCode["3xx"] += 1;
        report.totalRequest += 1;
        break;
      }

      case statusCodeNumber < 500: {
        report.statusCode["4xx"] += 1;
        report.totalRequest += 1;
        break;
      }

      case statusCodeNumber < 600: {
        report.statusCode["5xx"] += 1;
        report.totalRequest += 1;
        break;
      }
    }
  };

  parser[httpParser.kOnBody] = function (chunk, offset, length) {
    bodyChunks.push(chunk.slice(offset, offset + length));
  };

  parser[httpParser.kOnHeaders] = function (t) {
    trailers = t;
  };

  parser[httpParser.kOnMessageComplete] = function () {};

  return parser;
}

export { getParser };
