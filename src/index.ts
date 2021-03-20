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
  error?: NodeJS.ErrnoException;
};

const getDuration = (start: [number, number]) => {
  const end = process.hrtime(start);
  return { duration: Math.floor((end[0] * 1e9 + end[1]) / 1e6) };
};

export const tcping = (options: PingOptions): Promise<PingDetails> => {
  const socket = new Socket();
  const start = process.hrtime();

  return new Promise((resolve, reject) => {
    socket.connect(options.port, options.host, () => {
      resolve({ ...options, ...getDuration(start) });
      socket.destroy();
    });

    socket.setTimeout(options.timeout, () => {
      const error = Error(`timeout (${options.timeout}ms)`);
      reject({ error, ...options, ...getDuration(start) });
      socket.destroy();
    });

    socket.on('error', (error) => {
      reject({ error, ...options, ...getDuration(start) });
      socket.destroy();
    });
  });
};
