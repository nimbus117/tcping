import { formatDetails, validate } from '../src/cliHelpers';
import { supportsColor } from 'chalk';

describe('formatDetails', () => {
  it('returns success details string', () => {
    const details = formatDetails(4)({
      host: 'host',
      port: 80,
      duration: 10,
    });

    expect(details).toBe('host:80   10ms');
  });

  it('returns an error message details string', () => {
    const details = formatDetails(4)({
      host: 'host',
      port: 80,
      duration: 10,
      error: new Error('message'),
    });

    if (supportsColor)
      expect(details).toBe('host:80   10ms\u001b[31m message\u001b[39m');
    else expect(details).toBe('host:80   10ms message');
  });

  it('returns an ErrnoException code and syscall details string', () => {
    const error = new Error() as NodeJS.ErrnoException;
    error.code = 'code';
    error.syscall = 'syscall';

    const details = formatDetails(4)({
      host: 'host',
      port: 80,
      duration: 10,
      error: error,
    });

    if (supportsColor)
      expect(details).toBe('host:80   10ms\u001b[31m syscall (code)\u001b[39m');
    else expect(details).toBe('host:80   10ms syscall (code)');
  });
});

describe('validate', () => {
  it('validates the flag', () => {
    const invalid = validate([{ flag: 'port', number: 80, max: 65535 }]);
    expect(invalid.length).toBe(0);
  });

  it('validates the flag is a number', () => {
    // @ts-expect-error: ignored to test invalid user input
    const invalid = validate([{ flag: 'port', number: 'x', max: 65535 }]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 65535');
  });

  it('validates the flag is a number greater than 1', () => {
    const invalid = validate([{ flag: 'port', number: 0, max: 65535 }]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 65535');
  });

  it('validates the flag is a number less than max', () => {
    const invalid = validate([{ flag: 'port', number: 65536, max: 65535 }]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 65535');
  });

  it('validates the flag is a number less than default max', () => {
    const invalid = validate([{ flag: 'port', number: 600001 }]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 600000');
  });
});
