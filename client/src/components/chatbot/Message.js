import React from 'react';

const Message = (props) => {	
  return(<div className={props.speaks === "me" ? "right-align" : ""}>
    <span className = {props.speaks === "bot" ? "chat_avatar": ""}>
          {props.speaks === 'bot' ? <img src={require('../../assets/fj.jpg')}/> : ""}
          </span>
      <div className={`chatbubble ${props.speaks === "bot" ? "bot " : "me"}`}>
                  <span>{props.text}</span>
      </div>
  </div>
)};

export default Message;