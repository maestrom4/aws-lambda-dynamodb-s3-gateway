const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
// const dynamodbTableName = 'product-inventory';
const loginTbl = 'logInTbl';
const homePath = '/';
const loginPath = '/login';
const schedulePath = '/schedule';
const usersPath = '/users';

exports.handler = async function(event) {
    console.log('Request event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === homePath:
            response = await buildResponse(200);
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
        case event.httpMethod === 'PATCH' && event.path === loginPath:
            const req = JSON.parse(event.body);
            response = await updateLoginData(req.id, req.ukey, req.val);
            break;
        case event.httpMethod === 'DELETE' && event.path === loginPath:
            response = await updateLoginData(JSON.parse(event.body).id);
            break;
        default:
            response = buildResponse(404, '404 not found!');
    }
}


function updateLoginData(reqID, reqUkey, reqVal) {
    const params = {
        TableName: loginTbl,
        Key: {
            'loginKey': reqID
        },
        UpdateExpression: `set ${reqUkey} = :value`,
        ExpressionAttributeValues: {
            ':value': reqVal
        },
        ReturnValues: 'UPDATE_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Opearion: 'UPDATE',
            Message: 'SUCCESS',
            UpdateAttributes: response
        }
        return buildResponse(200, body)
    }, (error) => {
        console.error('Do your custom error handling here. I am just gonna log it: ', error)
    })
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

function buildResponse(statusCode, body = {}) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
};