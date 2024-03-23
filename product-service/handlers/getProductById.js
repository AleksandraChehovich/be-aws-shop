import { PRODUCTS_LIST } from "../mockData/mockProductsList";

export const handler = async (event, context, cb) => {
  try {
    const { productId } = event.pathParameters;
    const product = PRODUCTS_LIST.find(({ id }) => productId === id);

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
