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
        
        this.state = {
            showBot : false,
            welcomeSent:false,
            messages: [],
            botName :"Farooqui"
        };
        if(cookies.get('userID') === undefined){
            cookies.set('userID', uuid(), {path: '/'});
        }
        console.log("Session ID: "+cookies.get('userID'));


        this.toggleBot = this.toggleBot.bind(this);
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);

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

    resolveAfterXSeconds(time) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(time);
          }, time * 1000);
        });
      }
    async componentDidMount(){
        if(!this.state.welcomeSent){
            await this.resolveAfterXSeconds(1.2);
            this.df_event_query('Welcome');
            this.setState({ welcomeSent: true});
        }
        
    }

    componentDidUpdate(){
        if(this.state.showBot) {
            this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
          }
        if(this.talkInput){
            this.talkInput.focus();
        }
        
    }

    renderCards(cards){
        return cards.map((card, i) => <Card key = {i} payload = {card.structValue} />);
    }

    renderEachMessage(message, i){
        if(message.msg && message.msg.text && message.msg.text.text){
            return <Message key = {i} speaks = {message.speaks} text = {message.msg.text.text} />;
        }else if(message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards){
            return (
                <div key={i}>
                  <div className="container">
                    <div
                      style={{
                        height: 200,
                        width:
                          message.message.payload.fields.cards.listValue.values.length * 150,
                        paddingLeft: '12%'
                      }}
                    >
                      {this.renderCards(
                        message.message.payload.fields.cards.listValue.values
                      )}
                    </div>
                  </div>
                </div>
              );
            
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

    toggleBot() {
        this.setState({ showBot: !this.state.showBot });
      }

    _handleInputKeyPress(e){
        if(e.key === "Enter" && e.target.value !== ""){
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render(){
        const { showBot, botName } = this.state;

        if(showBot){
            return (
                <div className = 'chat'>
                {/* // <div class = 'chat' style = {{ height: 500, width:320, position: 'absolute', */}
                {/* //                  bottom: 20, right: 30, zIndex:1000}}> */}
                    <div id='chat_header' className = 'nav-wrapper' style={{ height:'55px'}}>
                        <span id = 'bot_name' style={{ top:'10px'}} >{botName}</span>
                        <span className="close" style={{float: 'right'}} onClick={this.toggleBot}>x</span>
                    </div>
    
                    <div id="chatbot" style={{ height:'375px', width : '100%',
                                            overflow: 'auto', background: 'white' }}>
                        {this.renderMessages(this.state.messages)}
                        <div ref = {(el) =>{ this.messagesEnd = el;}}
                            style = {{ float: 'left', clear: 'both'}}>
                        </div>
                    </div>


                    <div className="fab_field">
                      <a id="fab_send" className="fab"><i className="zmdi zmdi-mail-send"></i></a>
                      <textarea id="chatSend" name="chat_message" ref = {(input) => { this.talkInput = input; }} onKeyPress = {this._handleInputKeyPress} 
                                placeholder="Type here..." 
                                className="chat_field chat_message"></textarea>
                    </div>

                    {/* <div className = 'chatbot-form'>
                    <textarea type = 'text' ref = {(input) => { this.talkInput = input; }} onKeyPress = {this._handleInputKeyPress}
                                // style = {{paddingLeft : '1%',
                                //         paddingRight: '1%',
                                //         width: '98%',
                                //         backgroundColor: "lightgrey",
                                //         color : "#222222",
                                //         borderTop: '1px solid lightgrey',
                                //         marginBottom: 0
                                //         }}
                                        placeholder="Type here..." />
                    </div> */}
                        
                    
    
                </div> 
            );
        }else{
            return (
                <div
                  style={{
                    width: 250,
                    position: "absolute",
                    bottom: 0,
                    right: 30,
                    zIndex: 1000
                  }}
                >
                  <nav onClick={this.toggleBot}>
                    <div id="chatWindow-nav" className="nav-wrapper">
                      <span>{ botName }</span>
                    </div>
                  </nav>
                </div>
              );
        }
        
    }
} 

export default Chatbot;