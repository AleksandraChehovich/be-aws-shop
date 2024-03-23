import { PRODUCTS_LIST } from "../mockData/mockProductsList";

export const handler = async (event, context, callback) => {

  try {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow requests from any origin
          'Access-Control-Allow-Credentials': true, // Allow cookies and authorization headers
        },
        body: JSON.stringify(PRODUCTS_LIST),
      }
  } catch(error) {
    throw new Error('Products are not available');
  }

};
