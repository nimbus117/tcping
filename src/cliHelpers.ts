import { PingDetails } from './index';
import { red } from 'chalk';

const MAX_NUMBER = 600000;

export const formatDetails = (pad: number) => (pd: PingDetails): string => {
  const duration = pd.duration.toString().padStart(pad);
  let message = `${pd.host}:${pd.port} ${duration}ms`;

  const e = pd.error;
  if (e)
    message += red(
      'syscall' in e ? ` ${e.syscall} (${e.code})` : ` ${e.message}`
    );

  return message;
};

export const validateNumberFlags = (
  flags: { flag: string; number: number; max?: number }[]
): string[] =>
  flags
    .map((f) => {
      const max = f.max ? f.max : MAX_NUMBER;
      if (isNaN(Number(f.number)) || f.number < 1 || f.number > max) {
        return `Please provide a ${f.flag} between 1 and ${max}`;
      }
    })
    .filter((f): f is string => Boolean(f));
