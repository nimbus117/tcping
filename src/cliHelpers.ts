import { PingDetails } from './index';
import { red } from 'chalk';

const MAX_NUMBER = 600000;

export const formatDetails = (pad: number) => (pd: PingDetails): string => {
  const duration = pd.duration.toString().padStart(pad);

  let message = `${pd.host}:${pd.port} ${duration}ms`;

  const err = pd.error;
  if (err)
    message += red(
      'syscall' in err ? ` ${err.syscall} (${err.code})` : ` ${err.message}`
    );

  return message;
};

export const validateNumberFlags = (
  flags: { flag: string; number: number; max?: number }[]
): string[] =>
  flags
    .map((flag) => {
      const max = flag.max ? flag.max : MAX_NUMBER;
      if (isNaN(Number(flag.number)) || flag.number < 1 || flag.number > max) {
        return `Please provide a ${flag.flag} between 1 and ${max}`;
      }
    })
    .filter((flag): flag is string => Boolean(flag));
