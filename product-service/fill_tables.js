const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'eu-west-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

function getRandomPrice(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct(num) {
    const product = {
        id: uuidv4(),
        title: `Product#${num + 1} title`,
        description: `Product#${num + 1} description`,
        price: getRandomPrice(10, 50),
    }
    return product;
}

function generateStock(productId) {
    const stock = {
        product_id: productId,
        count: getRandomPrice(1, 20),
    }
    return stock;
}

async function fillTables() {
    try {
        const items = [];

        for (let i = 0; i < 10; i++) {
            const product = generateProduct(i);
            const productParams = {
                Put: {
                  TableName: 'PRODUCTS_TABLE',
                  Item: product,
                },
            };
            items.push(productParams);

            const stock = generateStock(product.id);
            const stockParams = {
                Put: {
                  TableName: 'STOCK_TABLE',
                  Item: stock,
                },
            };
            items.push(stockParams);
        }

        console.log('TransactItems:', items);

        const params = {
            TransactItems: items,
        };
    
        console.log('Params:', params);

        await dynamodb.transactWrite(params).promise();

        console.log('Tables filled with test data successfully.');
    } catch (error) {
        console.error('Error filling tables:', error);
    }
}

fillTables();
