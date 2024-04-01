import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, cb) => {
  try {
    const { productId } = event.pathParameters;
    console.log(productId);
    // const productId = 'b10c6208-8ae3-4d03-8d7f-a2b05e976345';
    const product = await dynamodb.query({ 
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {':id': productId},
    }).promise();

    const stock = await dynamodb.query({ 
      TableName: process.env.STOCK_TABLE,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: {':product_id': productId},
    }).promise();

    console.log(product)

    if (product.Items.length === 0) {
      throw new Error('Products is not found');
    }

    const result = {
      ...product.Items[0],
      count: stock.Items[0]?.count || 0,
    }
    console.log(result);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result),
    }
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify('Products is not found'),
    }
  }
};
