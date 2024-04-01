import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, callback) => {
  try {
    const products = await dynamodb.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();

    const result = await Promise.all(products.Items.map(async (item) => {
      const stockItem = await dynamodb.scan({ 
        TableName: process.env.STOCK_TABLE,
        FilterExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {':product_id': item.id},
      }).promise();
      console.log('stockItem: ', stockItem);
      return {
        ...item,
        count: stockItem.Items[0]?.count || 0,
      }
    }));
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
      body: JSON.stringify('Products are not available'),
    }
  }

};
