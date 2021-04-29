import { formatResult, validateNumberFlags } from '../src/cliHelpers';
import { supportsColor } from 'chalk';

describe('formatResult', () => {
  it('returns success details string', () => {
    const details = formatResult(4)({
      host: 'host',
      port: 80,
      duration: 10,
      timeout: 5000,
    });

    expect(details).toBe('host:80   10ms');
  });

  it('returns an error message details string', () => {
    const details = formatResult(4)({
      host: 'host',
      port: 80,
      duration: 10,
      timeout: 5000,
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

    const details = formatResult(4)({
      host: 'host',
      port: 80,
      duration: 10,
      timeout: 5000,
      error: error,
    });

    if (supportsColor)
      expect(details).toBe('host:80   10ms\u001b[31m syscall (code)\u001b[39m');
    else expect(details).toBe('host:80   10ms syscall (code)');
  });
});

describe('validateNumberFlags', () => {
  it('validates the flag', () => {
    const invalid = validateNumberFlags([
      { name: 'port', value: 80, max: 65535 },
    ]);
    expect(invalid.length).toBe(0);
  });

  it('validates the flag is a number', () => {
    const invalid = validateNumberFlags([
      // @ts-expect-error: ignored to test invalid user input
      { name: 'port', value: 'x', max: 65535 },
    ]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 65535');
  });

  it('validates the flag is a number greater than min', () => {
    const invalid = validateNumberFlags([
      { name: 'port', value: 50, max: 65535, min: 100 },
    ]);
    expect(invalid[0]).toBe('Please provide a port between 100 and 65535');
  });

  it('validates the flag is a number less than max', () => {
    const invalid = validateNumberFlags([
      { name: 'port', value: 65536, max: 65535 },
    ]);
    expect(invalid[0]).toBe('Please provide a port between 1 and 65535');
  });

  it('validates the flag is a number less than default max', () => {
    const invalid = validateNumberFlags([{ name: 'timeout', value: 3600001 }]);
    expect(invalid[0]).toBe('Please provide a timeout between 1 and 3600000');
  });

  it('validates the flag is a number greater than the default min', () => {
    const invalid = validateNumberFlags([{ name: 'timeout', value: 0 }]);
    expect(invalid[0]).toBe('Please provide a timeout between 1 and 3600000');
  });
});
