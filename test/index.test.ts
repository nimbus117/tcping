import { tcping } from '../src/index';

test('returns details and no error on successful ping', async () => {
  const response = await tcping({
    host: 'google.com',
    port: 443,
    timeout: 1000,
  });
  expect(response.duration).toBeGreaterThanOrEqual(1);
  expect(response.host).toBe('google.com');
  expect(response.port).toBe(443);
  expect(response.error).toBeUndefined();
});

test('returns timeout error', async () => {
  try {
    await tcping({ host: 'google.com', port: 444, timeout: 100 });
  } catch (errorResponse) {
    expect(errorResponse.error?.message).toBe('timeout (100ms)');
  }
});

test('returns address lookup error', async () => {
  try {
    await tcping({ host: 'blah', port: 80, timeout: 1000 });
  } catch (errorResponse) {
    expect(errorResponse.error?.syscall).toBe('getaddrinfo');
    expect(['ENOTFOUND', 'EAI_AGAIN']).toContain(errorResponse.error?.code);
  }
});
