import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event, context, cb) => {
    try {
      const body = event.body;
      const { title, description, price, count } = JSON.parse(body);

    if (!title || !description || !price || !count) {
      return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ error: 'Invalid product data. Please provide title, description, price, and count.' }),
      };
    }

    const id = uuidv4()
    const newItem = {
        title,
        description,
        price,
        id,
    }
    console.log({
      ...newItem,
      count,
    });
    await dynamodb.put({ 
        TableName: process.env.PRODUCTS_TABLE,
        Item: newItem,
    }).promise();
    await dynamodb.put({ 
        TableName: process.env.STOCK_TABLE,
        Item: {
            product_id: id,
            count,
        },
    }).promise();

    console.log('Product has been successfully added!');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(newItem),
      }
    } catch(error) {
      return {
        statusCode: 500,
        body: JSON.stringify('Product is not available'),
      }
    }
  };
