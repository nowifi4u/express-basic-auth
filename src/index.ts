import * as express from 'express';
import passport from 'passport';
import * as config from '#src/config/express';

import routers from '#src/routers/index';

const app = express.default();

if (config.cors) {
  const cors = (await import('cors')).default;
  app.use(cors(config.cors));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
if (config.debug) app.use((await import('morgan')).default('combined'));

console.log(`Registering routers...`);
app.use('/', routers);

if (config.http) {
  const http = (await import('http')).default;
  const httpServer = http.createServer(app);
  httpServer.listen(config.http.port);
  console.log(`httpServer: listening on port ${String(config.http.port)}`);
}
if (config.https) {
  const https = (await import('https')).default;
  const httpsServer = https.createServer(config.https.credentials, app);
  httpsServer.listen(config.https.port);
  console.log(`httpsServer: listening on port ${String(config.https.port)}`);
}

import prompts from 'prompts';
import { db, sql } from './connector';
// Fix to make db being loaded
db;
sql;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
while (true) {
  const c = await prompts({
    type: 'text',
    name: 'command',
    message: 'eval:',
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!c.command) process.exit(0);

  try {
    // eslint-disable-next-line no-eval
    console.log(await eval(c.command));
  } catch (err: any) {
    console.log(err);
  }
}
