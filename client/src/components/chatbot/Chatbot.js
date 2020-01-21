import React, { Component} from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

import Message from './Message';
import Card from './Card';

const cookies = new Cookies();


class Chatbot extends Component{
    messagesEnd;
    talkInput;

    constructor(props){
        super(props);

        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);

        this.state = {
            messages: []
        };
        if(cookies.get('userID') === undefined){
            cookies.set('userID', uuid(), {path: '/'});
        }
        console.log("Session ID: "+cookies.get('userID'));
    }
    
    async df_text_query(queryText){
        let says = {
            speaks : 'me',
            msg : {
                text: {
                    text: queryText
                }
            }
        };

        this.setState({messages : [...this.state.messages, says]});

        const res = await axios.post('/api/df_text_query', {text: queryText, userID:cookies.get('userID')});

        for(let msg of res.data.fulfillmentMessages){
            console.log(JSON.stringify(msg));
            says = {
                speaks: 'bot',
                msg : msg
            }
            this.setState({messages: [...this.state.messages, says]});
        }

    }

    async df_event_query(eventName){
        const res = await axios.post('/api/df_event_query', {event: eventName, userID:cookies.get('userID')});

        for (let msg of res.data.fulfillmentMessages){
            let says = {
                speaks: 'bot', 
                msg: msg
            }
            this.setState({messages: [...this.state.messages, says]});
        }
    }

    componentDidMount(){
        this.df_event_query('Welcome');
    }

    componentDidUpdate(){
        this.messagesEnd.scrollIntoView({ behaviour : "smooth"});
        this.talkInput.focus();
    }

    renderCards(cards){
        return cards.map((card, i) => <Card key = {i} payload = {card.structValue} />);
    }

    renderEachMessage(message, i){
        if(message.msg && message.msg.text && message.msg.text.text){
            return <Message key = {i} speaks = {message.speaks} text = {message.msg.text.text} />;
        }else if(message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards){
            return <div key={i}>
                <div className = "card-panel grey lighten-5 z-depth-1">
                    <div style = {{overflow : 'hidden'}}>
                    <a href = "/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                    </div>
                    <div style={{ overflow:"auto", overflowY:'scroll'}}>
                        <div style = {{ height: 300, width: message.msg.payload.fields.cards.listValue.values.length*270}}>
                            {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                        </div>
                    </div>
                </div>
            </div>
        }
    }

    renderMessages(stateMessages){
        if(stateMessages){
            return stateMessages.map((message, i) => {
                return this.renderEachMessage(message, i);
            });
        }else{
            return null;
        }
    }

    _handleInputKeyPress(e){
        if(e.key === "Enter"){
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render(){
        return (
            <div style = {{ height: 400, width:400, float: 'right'}}>
                <div id="chatbot" style={{ height:'100%', width : '100%', overflow: 'auto' }}>
                    <h2>CHATBOT</h2>
                    {this.renderMessages(this.state.messages)}
                    <div ref = {(el) =>{ this.messagesEnd = el;}}
                        style = {{ float: 'left', clear: 'both'}}>
                    </div>
                    <input type = 'text' ref = {(input) => { this.talkInput = input; }} onKeyPress = {this._handleInputKeyPress} />
                </div>

            </div> 
        )
    }
} 

export default Chatbot;