#!/usr/bin/env node
/* istanbul ignore file */
import { green, red, yellow } from 'chalk';
import ora from 'ora';
import meow = require('meow');
import { tcping } from './index';
import { formatDetails, validate } from './cliHelpers';

const DEFAULT_COUNT = 4;
const DEFAULT_DELAY = 1000;
const DEFAULT_TIMEOUT = 5000;

export const cli = meow(
  `
    Usage
      $ tcping <host> <port>

    Options
      --host       | -h | host to ping
      --port       | -p | port on host to connect to
      --continuous | -x | ping the host continuously
      --count      | -c | ping the host this many times (default: ${DEFAULT_COUNT})
      --delay      | -d | the delay between each ping in milliseconds (default: ${DEFAULT_DELAY})
      --timeout    | -t | timeout in milliseconds (default: ${DEFAULT_TIMEOUT})

    Examples
      $ tcping --host google.com --port 443
      $ tcping localhost 8080
      $ tcping 192.168.1.100 22 -c 1
      $ tcping desktop 3389 -x -d 5000
  `,
  {
    flags: {
      host: {
        type: 'string',
        alias: 'h',
        isRequired: (flags, input) => !input[0],
      },
      port: {
        type: 'number',
        alias: 'p',
        isRequired: (flags, input) => !input[1],
      },
      timeout: {
        type: 'number',
        alias: 't',
        default: DEFAULT_TIMEOUT,
      },
      continuous: {
        type: 'boolean',
        alias: 'x',
        default: false,
      },
      count: {
        type: 'number',
        alias: 'c',
        default: DEFAULT_COUNT,
      },
      delay: {
        type: 'number',
        alias: 'd',
        default: DEFAULT_DELAY,
      },
    },
  }
);

(async () => {
  const host = (cli.input[0] || cli.flags.host) as string;
  const port = (cli.input[1] || cli.flags.port) as number;
  const { count, delay, timeout, continuous } = cli.flags;

  const validation = validate([
    { flag: 'port', number: port, max: 65535 },
    { flag: 'count', number: count },
    { flag: 'delay', number: delay },
    { flag: 'timeout', number: timeout },
  ]);

  if (validation.length) {
    validation.forEach((message) => console.log(red(message)));
    return;
  }

  const spinner = ora().start();
  const format = formatDetails(timeout.toString().length);

  for (let i = 0; continuous || i < count; i++) {
    try {
      spinner.text = green('pinging...');
      const pingResponse = await tcping({ host, port, timeout });
      spinner.succeed(format(pingResponse));
    } catch (errorResponse) {
      spinner.fail(format(errorResponse));
    }

    if (continuous || i < count - 1) {
      spinner.start(yellow('waiting...'));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
})();
