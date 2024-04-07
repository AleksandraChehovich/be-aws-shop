import AWS from 'aws-sdk-mock';
import { handler } from '../importProductsFile';

describe('importProductFile Lambda Function', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('should return a signed URL when provided with a valid filename', async () => {
    const event = {
      queryStringParameters: {
        name: 'products.csv',
      },
    };

    const mockSignedUrl = 'https://mocksignedurl.example.com';
    AWS.mock('S3', 'getSignedUrlPromise', (_operation, _params) => {
      return mockSignedUrl;
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(mockSignedUrl);
  });

  it('should return an error response when no filename is provided', async () => {
    const event = {
      queryStringParameters: {},
    };

    const consoleErrorSpy = jest.spyOn(console, 'error');
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Internal Server Error');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});