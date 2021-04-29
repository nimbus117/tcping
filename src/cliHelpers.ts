import { TcpingResult } from './index';
import { red } from 'chalk';

const MIN_NUMBER = 1;
const MAX_NUMBER = 3.6e6;

export const formatResult = (length: number) => (pr: TcpingResult): string => {
  const duration = pr.duration.toString().padStart(length);

  let message = `${pr.host}:${pr.port} ${duration}ms`;

  const err = pr.error;
  if (err)
    message += red(
      'syscall' in err ? ` ${err.syscall} (${err.code})` : ` ${err.message}`
    );

  return message;
};

export const validateNumberFlags = (
  flags: { name: string; value: number; min?: number; max?: number }[]
): string[] =>
  flags
    .map((flag) => {
      const max = flag.max ? flag.max : MAX_NUMBER;
      const min = flag.min ? flag.min : MIN_NUMBER;
      if (isNaN(Number(flag.value)) || flag.value < min || flag.value > max) {
        return `Please provide a ${flag.name} between ${min} and ${max}`;
      }
    })
    .filter((flag): flag is string => Boolean(flag));
