function getRandomInterger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getBody() {
  return {
    field1: getRandomInterger(110, 110),
    field2: getRandomInterger(1, 1),
  };
}

const configuration = {
  SETTING: {
    CCU: 100,
    DOWNTIME: 1000,
    STRESS_TIME: 10
  },
  API: {
    HOST: "example.com",
    PORT: 80,
    METHOD: "POST",
    PATH: "/api/v1/xxx",
    BODY: getBody(),
  },
};

const header = [
  `${configuration.API.METHOD} ${configuration.API.PATH} HTTP/1.1`,
  `Host: ${configuration.API.HOST}:${configuration.API.PORT}`,
  `Connection: keep-alive`,
];

function getNewRequest() {
  const body = getBody();
  // console.log(`Send request : ${JSON.stringify(body)}`);

  const newHeader = [].concat(header);

  newHeader.push(`Content-Type: application/json`);
  newHeader.push(
    `Content-Length: ${Buffer.from(JSON.stringify(body)).length}`
  );

  let request = Buffer.from(newHeader.join("\r\n") + "\r\n\r\n", "utf8");
  request = Buffer.concat([request, Buffer.from(JSON.stringify(body))]);

  return request;
}

export { configuration, header, getNewRequest };
