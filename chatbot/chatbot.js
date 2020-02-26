'use strict'

const dialogflow = require('dialogflow');
const config = require('../config/keys');

const structjson = require('./structJSON');

 
const credentials = {
    private_key: config.googlePrivateKey,
    client_email: config.googleClientEmail
    };



const sessionClient = new dialogflow.SessionsClient({credentials});


module.exports = {
    textQuery: async function(text, userID, parameters = {}){
        const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionId+userID);

        let self = module.exports;

        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: text,
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };
        
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);

        return responses
    },

    eventQuery: async function(event, userID, parameters = {}){
        const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionId+userID);

        let self = module.exports;

        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            }
        };
        
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);

        return responses
    },

    handleAction: function(responses){
        return responses;
    }
}