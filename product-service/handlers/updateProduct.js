import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, cb) => {
  try {
    const { productId } = event.pathParameters;
    const product = await dynamodb.query({ 
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {':id': productId},
    }).promise();

    if (!product) {
      throw new Error('Products is not found');
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    }
  } catch(error) {
    throw new Error('Products is not found');
  }
};
