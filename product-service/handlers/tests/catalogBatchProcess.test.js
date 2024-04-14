import { handler } from '../catalogBatchProcess';
import awsSdkMock from 'aws-sdk-mock';

describe('handler', () => {
  afterEach(() => {
    awsSdkMock.restore();
  });

  it('should publish messages to SNS for each product', async () => {
    const snsMock = {
      publish: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    };

    awsSdkMock.mock('SNS', 'publish', snsMock.publish);

    const event = {
      Records: [
        {
          body: JSON.stringify({
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            price: '24',
            title: 'ProductOne',
            count: '1',
            '﻿"description"': 'Short Product Description1',
          }),
        },
      ],
    };

    const callback = jest.fn();

    await handler(event, null, callback);

    expect(snsMock.publish).toHaveBeenCalledTimes(event.Records.length);
    event.Records.forEach((record) => {
      expect(snsMock.publish).toHaveBeenCalledWith({
        Subject: 'New products have been added',
        Message: JSON.stringify({
          id: record.id,
          price: record.price,
          title: record.title,
          count: record.count,
          description: record['﻿"description"'],
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:992382660389:createProductTopic',
      });
    });

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  it('should handle errors and return internal server error', async () => {
    const snsMock = {
      publish: jest.fn().mockImplementation(() => {
        throw new Error('Publish failed');
      }),
    };

    awsSdkMock.mock('SNS', 'publish', snsMock.publish);

    const event = {
      Records: [
        {
          body: JSON.stringify({
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            price: '24',
            title: 'ProductOne',
            count: '1',
            '﻿"description"': 'Short Product Description1',
          }),
        },
      ],
    };

    const callback = jest.fn();

    await handler(event, null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });
});