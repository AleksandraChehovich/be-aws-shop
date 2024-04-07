import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

export const handler = async (event, context, cb) => {

  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const { Records } = event;
  const promises = [];

  try {

    for (const record of Records) {
      const bucketName = record.s3.bucket.name;
      const key =  decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const params = {
        Bucket: bucketName,
        Key: key,
      }
  
      console.log(`Processing object: ${key} in bucket: ${bucketName}`);
  
      const s3Stream = s3.getObject(params).createReadStream();
  
      const recordPromise = new Promise((resolve, reject) => {
        const newFolderKey = key.replace('uploaded', 'parsed')
        const paramsForCopy = {
          Bucket: bucketName,
          CopySource: `${bucketName}/${key}`,
          Key: key.replace('uploaded', 'parsed'),
        }
        s3Stream.pipe(csvParser())
          .on('data', data => {
            console.log('record:', data);
          })
          .on('end', async () => {
            console.log('Parsing completed for:', key);
            try {
  
              await s3.copyObject(paramsForCopy).promise();
  
              await s3.deleteObject(params).promise();
  
              console.log('File moved to parsed folder:', key.replace('uploaded', 'parsed'));
              resolve();
            } catch(error) {
              console.error('Error moving file:', error);
              reject(error);
            }
          })
          .on('error', (error) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          });
      })
  
      promises.push(recordPromise);
    }

    await Promise.all(promises);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'All processes completed!' }),
    }
  } catch(error) {
    console.error('Error processing S3 events:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
};
