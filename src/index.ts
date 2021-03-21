import { Socket } from 'net';

export type PingOptions = {
  host: string;
  port: number;
  timeout: number;
};

export type PingDetails = {
  host: string;
  port: number;
  duration: number;
  error?: NodeJS.ErrnoException | Error;
};

export const tcping = (options: PingOptions): Promise<PingDetails> => {
  const socket = new Socket();
  const start = process.hrtime();

  const result = (error: PingDetails['error'] = undefined) => {
    const duration = process.hrtime(start);
    socket.destroy();
    return {
      ...options,
      duration: Math.floor((duration[0] * 1e9 + duration[1]) / 1e6),
      error,
    };
  };

  return new Promise((resolve, reject) => {
    socket.connect(options.port, options.host, () => resolve(result()));
    socket.on('error', (error) => reject(result(error)));
    socket.setTimeout(options.timeout, () =>
      reject(result(Error(`timeout (${options.timeout}ms)`)))
    );
  });
};
