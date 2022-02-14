const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'product-inventory';
const loginPath = '/login';
const schedulePath = '/schedule';
const usersPath = '/users';

exports.handler = async function(event) {
    console.log('Request event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === loginPath:
            response = await loginPath(200);
            break;
        case event.httpMethod === 'GET' && event.path === schedulePath:
            response = await getSchedule(event.queryStringParameters.scheduleId);
            break;
        case event.httpMethod === 'GET' && event.path === usersPath:
            response = await getUsers(event.queryStringParameters.userId);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = await login(JSON.parse(event.body));
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = await login(JSON.parse(event.body));
            break;
    }
}

function loginPath(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
};