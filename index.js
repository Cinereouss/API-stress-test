import Net from 'net';
import tls from 'tls';
import { configuration, header, getNewRequest } from './config.js';
import { getParser } from './lib/http-parser.js';
import cliProgress from 'cli-progress';

const processBar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

const report = {
  totalRequest: 0,
  statusCode: {
    '5xx': 0,
    '4xx': 0,
    '3xx': 0,
    '2xx': 0,
    '1xx': 0,
  },
};

const parser = getParser(report);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
(async () => {
  const client = tls.connect(
    443,
    'api.product.envirocapture.au',
    { servername: 'api.product.envirocapture.au' },
    async function () {
      console.log('TCP connection established with the server.');
      // client.setKeepAlive(true);

      const startTime = Date.now();
      const endTime = new Date(
        Date.now() + configuration.SETTING.STRESS_TIME * 1000,
      ).getTime();

      processBar.start(1000 * configuration.SETTING.STRESS_TIME, Date.now());

      while (Date.now() <= endTime) {
        for (let i = 0; i < configuration.SETTING.CCU; i++)
          client.write(getNewRequest());

        await sleep(configuration.SETTING.DOWNTIME);
        processBar.update(Date.now() - startTime);
      }

      console.log('\n\rClose connection and calculator ....');
      client.end();
    },
  );

  // client.setEncoding('utf8');

  client.on('data', function (chunk) {
    parser.execute(chunk);
  });

  client.on('end', function () {
    console.log(report);
    console.log('Requested an end to the TCP connection');
  });
})();
