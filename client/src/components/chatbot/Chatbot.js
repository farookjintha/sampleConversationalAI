import React, { Component} from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

import Message from './Message';
import Card from './Card';
import Details from './Details';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();


class Chatbot extends Component{
    messagesEnd;
    talkInput;

    constructor(props){
        super(props);
        
        this.state = {
            showBot : false,
            welcomeSent:false,
            rotate:false,
            messages: [],
            inputValue:'',
            botInfo :`FJ's Virtual Bot`
        };
        if(cookies.get('userID') === undefined){
            cookies.set('userID', uuid(), {path: '/'});
        }
        console.log("Session ID: "+cookies.get('userID'));


        this.toggleBot = this.toggleBot.bind(this);
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleSubmitButton = this._handleSubmitButton.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

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
            this.df_event_query('initial_message');
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
                    <div>
                      {this.renderCards(
                        message.msg.payload.fields.cards.listValue.values
                      )}
                    </div>
                  </div>
                </div>
              );
        }else if(message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.quick_replies){
          return <QuickReplies text = {message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                               key = {i}
                               replyClick = {this._handleQuickReplyPayload}
                               speaks = {message.speaks}
                               payload = {message.msg.payload.fields.quick_replies.listValue.values} />
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
        this.setState({ 
          showBot: !this.state.showBot
          // rotate: !this.state.rotate
         });
      }

    _handleQuickReplyPayload(event, payload, text){
      event.preventDefault();
      event.stopPropagation();

      this.df_text_query(text);

    }


    _handleInputChange(e){
      this.setState({inputValue: e.target.value});
      }


    _handleInputKeyPress(e){
      
        if(e.key === "Enter" && e.target.value !== ''){
            e.preventDefault();
            this.df_text_query(e.target.value);
            e.target.value = '';
            this.state.inputValue = '';
        }
    }

    _handleSubmitButton(){
      // e.preventDefault();
      if(this.state.inputValue !== ''){
        console.log(this.state.inputValue);
        this.df_text_query(this.state.inputValue);
        this.state.inputValue = '';
      }
    }
    

    render(){
        const { showBot, botInfo } = this.state;

        if(showBot){
            return (
              <div className = 'fabs'>
                <div className = 'chat is-visible'>
                    <div className='chat_header'>
                    <div className="chat_option">
                        <span className="header_img">
                          <img alt = "#" src={require('../../assets/fj.jpg')}/>
                          </span>
                          <span className = 'bot_info'>{botInfo}</span><br />
                          {/* <span className="online"> (Online) </span> */}
                          {/* <span className="info" style={{float: 'right'}} onClick = {this.toggleDetails}></span> */}
                          <Details />
                          <br />
                       </div>
                    </div>
                    <div  className="chat_converse">
                        {this.renderMessages(this.state.messages)}
                        <div ref = {(el) =>{ this.messagesEnd = el;}} style={{ float: "left", clear: "both" }} />
                </div>
                    <form className="fab_field">
                      <input id="chatSend" value = {this.state.inputValue} onKeyPress = {this._handleInputKeyPress}  onChange={this._handleInputChange}
                                placeholder="Type here..." autoComplete="off"
                                className="chat_field chat_message" ></input>
                      <div className="fab fab_send"><div className="zmdi zmdi-mail-send"
                      onClick = {this._handleSubmitButton}></div></div>
                    
                    
                    </form>
                  </div>
                  <a id="prime" className="fab is-float is-visible" onClick={this.toggleBot}><i className={`prime zmdi zmdi-close is-active is-visible rotate`}></i></a>
              </div> 
            );
        }else{
            return (
                <div className = 'fabs'>
                  <a id="prime" className = 'fab' onClick={this.toggleBot}>
                    <i className="prime zmdi zmdi-comment-outline"></i>
                  </a>
                </div>
              );
        }
        
    }
} 

export default Chatbot;