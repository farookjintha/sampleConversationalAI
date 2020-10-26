import React from 'react';

const BotSummary = () =>{
    return(
        <div className = 'show_details chat_converse'>
            <span id = 'summary-head'>
                <p>Bot Summary</p>
            </span>
            <p id = 'summary-body'>
                This bot is powered by AI to provide better user experience. <br/><br/>
                The Complete SDLC has been implemented right from designing till CI/CD. <br/><br/>
                In order to make this bot a light-weighted one, it uses React for the front-end which is then 
                integrated with a NLP (Seq2Seq) model with a Flask(backend) server. On the other hand, it has Dialogflow integration as a backup, an NLU agent which is served using Node.js and Express. <br/><br/>
                This chatbot is progressing every now and then. Feel free to converse with it. <br/>
                <br/>
                <br/>
                Regards,<br/>
                Farook Jintha 
            </p>
        </div>
    )
};

export default BotSummary;