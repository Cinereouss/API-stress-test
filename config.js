function getRandomInterger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getBody() {
  return {
    email: 'xxxx',
    password: 'xxxx',
  };
}

const configuration = {
  SETTING: {
    CCU: 10,
    DOWNTIME: 1000,
    STRESS_TIME: 60,
  },
  API: {
    HOST: 'xxxxxx',
    PORT: 443,
    METHOD: 'POST',
    PATH: '/api/sign-in',
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

  const newHeader = [].concat(header);

  newHeader.push(`Content-Type: application/json`);
  newHeader.push(`Content-Length: ${Buffer.from(JSON.stringify(body)).length}`);

  let request = Buffer.from(newHeader.join('\r\n') + '\r\n\r\n', 'utf8');
  request = Buffer.concat([request, Buffer.from(JSON.stringify(body))]);

  return request;
}

export { configuration, header, getNewRequest };
