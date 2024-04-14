import AWS from 'aws-sdk';

export const handler = async (event, _, callback) => {
  console.log('catalogBatchEvent: ', event);
  const sns = new AWS.SNS();

  const { Records } = event;
  const products = Records.map(({ body }) => {
    const newBody = JSON.parse(body);
    if (!newBody.description && newBody['﻿"description"']) {
      newBody.description = newBody['﻿"description"'];
      delete newBody['﻿"description"'];
    }
    return newBody;
  });

  try {

    products.forEach(async product => {
      console.log('Product: ', JSON.stringify(product));
      await sns.publish({
        Subject: "New products have been added",
        Message: JSON.stringify(product),
        TopicArn: "arn:aws:sns:eu-west-1:992382660389:createProductTopic",
      }).promise();
    });

    console.log('Send message for products: ', products)

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch(error) {
      console.error('Error: ', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      }
  }
}