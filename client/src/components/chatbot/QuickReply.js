import React from 'react';

const QuickReply = (props) =>{
    if(props.reply.structValue.fields.payload){
        return(
            <a className = 'quick_reply_buttons'
            onClick = {(event) => props.click(
                event, 
                props.reply.structValue.fields.payload.stringValue,
                props.reply.structValue.fields.text.stringValue
            )}>
                {props.reply.structValue.fields.text.stringValue}</a>
            );
    }else{
        return(
            <a className = 'quick_reply_buttons'>
                {props.reply.structValue.fields.text.stringValue}</a>
            );
    }

    
};

export default QuickReply;