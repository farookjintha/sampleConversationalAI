'use strict'

const dialogflow = require('dialogflow');
const config = require('../config/keys');

const structjson = require('./structjson');
// const privateKeyJSON = require('../config/credentials/botman-c3a4c-0fd682daad87.json'); 

let configCred = {
    credentials: {
        private_key: "privateKey",
        client_email: "clientEmail"
    }
};


const sessionClient = new dialogflow.SessionsClient(configCred);
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionId);


module.exports = {
    textQuery: async function(text, parameters = {}){
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

    eventQuery: async function(event, parameters = {}){
        let self = module.exports;

        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                name: event,structjson.jsonToStructProto(parameters),
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