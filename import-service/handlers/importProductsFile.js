import AWS from 'aws-sdk';

export const handler = async (event, context, callback) => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  let status = 200;
  console.log("event: ", event);
  const { name } = event.queryStringParameters;

  if (!name) return;
  const Key = `uploaded/${name}`;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    Expires: 600,
    ContentType: 'text/csv',
  }

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    console.log("signedUrl: ", signedUrl);

    const response = {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        signedUrl
      }),
    }

    return response;

  } catch(error) {
    status = 500;
    console.error(error);

    return {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
};
