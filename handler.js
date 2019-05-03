'use strict';

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
require("aws-sdk/clients/apigatewaymanagementapi");

module.exports.connectionManager = (event, context, callback) => {
  if (event.requestContext.eventType === "CONNECT") {
    console.log('connected from client');
    return {
      statusCode: 200,
      body: "Connected"
    };
  } else if (event.requestContext.eventType === "DISCONNECT") {
    console.log('disconnect from client');
    return {
      statusCode: 200,
      body: "Disconnected"
    };
  }
};

module.exports.defaultMessage = (event, context, callback) => {
  callback(null);
};

module.exports.sendMessage = async (event) => {
  send(event, connectionId);
}

const send = (event, connectionId) => {
  const postData = JSON.parse(event.body).data;
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: postData })
    .promise();
};