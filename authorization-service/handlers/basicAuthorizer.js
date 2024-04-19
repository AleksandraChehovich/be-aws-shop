export const handler = (event, context, callback) => {
    console.log('Auth event: ', event);

    const { authorizationToken, methodArn } = event;
    const encodedCreds = authorizationToken.split(' ')[1];

    if (event.type !== 'TOKEN' || !encodedCreds) {
        callback('Unauthorized'); // Return a 401 Unauthorized response
    }
    
    try {
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log('username: ', username, 'password: ', password);

        const storedPassword = process.env[username];
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

        const policy = getPolicy(encodedCreds, methodArn, effect);

        callback(null, policy);

    } catch(error) {
        console.log(error);
        callback(`Unauthorized: ${error.message}`);
    }
};

function getPolicy(creds, methodArn, effect) {
    return {
        principalId: creds,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Resource: methodArn,
                Effect: effect,
              },
            ],
        },
    }
}
