import { TcpingResult } from './index';
import { red } from 'chalk';

const MIN_NUMBER = 1;
const MAX_NUMBER = 3.6e6;

export const formatResult = (length: number) => (
  result: TcpingResult
): string => {
  const duration = result.duration.toString().padStart(length);
  let message = `${result.host}:${result.port} ${duration}ms`;

  if (result.error)
    message += red(
      'syscall' in result.error
        ? ` ${result.error.syscall} (${result.error.code})`
        : ` ${result.error.message}`
    );

  return message;
};

export const validateNumberFlags = (
  flags: { name: string; value: number; min?: number; max?: number }[]
): string[] =>
  flags
    .map((flag) => {
      const max = flag.max ?? MAX_NUMBER;
      const min = flag.min ?? MIN_NUMBER;

      if (isNaN(Number(flag.value)) || flag.value < min || flag.value > max) {
        return `Please provide a ${flag.name} between ${min} and ${max}`;
      }
    })
    .filter((flag): flag is string => Boolean(flag));
