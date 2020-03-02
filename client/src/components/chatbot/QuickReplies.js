import React, {Component} from 'react';
import QuickReply from './QuickReply';

class QuickReplies extends Component{
    constructor(props){
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    _handleClick(event, payload, text){
        this.props.replyClick(event, payload, text);
    }

    renderQuickReply(reply, i){
        return <QuickReply key={i} click={this._handleClick} reply = {reply}/>
    }

    renderQuickReplies(quickReplies){
        if(quickReplies){
            return quickReplies.map((reply, i) => {
                return this.renderQuickReply(reply, i);
            })
        }else{
            return null;
        }
    }


    render(){
        return(
            <div className = 'follow-up'>
                <span className="chatbubble bot">
                    {/* <div className = 'quick-replies'> */}
                        {this.props.text && <p>{this.props.text.stringValue}</p>}
                    {/* </div> */}
                </span>
                <span className = 'button-options'>
                    {this.renderQuickReplies(this.props.payload)}
                </span>
            </div>
        )
    };

}

export default QuickReplies;