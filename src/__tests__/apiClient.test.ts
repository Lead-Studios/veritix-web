import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '../lib/apiClient';

const server = setupServer(
  rest.get('http://localhost:3000/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'success' }));
  }),
  rest.post('http://localhost:3000/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'posted' }));
  }),
  rest.get('http://localhost:3000/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'error' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('apiClient', () => {
  it('should make a GET request', async () => {
    const data = await apiClient.get('/test');
    expect(data).toEqual({ message: 'success' });
  });

  it('should make a POST request', async () => {
    const data = await apiClient.post('/test', { body: 'content' });
    expect(data).toEqual({ message: 'posted' });
  });

  it('should throw an error on non-2xx response', async () => {
    await expect(apiClient.get('/error')).rejects.toThrow('API request failed');
  });
});
