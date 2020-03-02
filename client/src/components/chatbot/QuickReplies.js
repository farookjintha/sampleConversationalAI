import React, {Component} from 'react';
import QuickReply from './QuickReply';


class QuickReplies extends Component{
    constructor(props){
        super(props);
        this.state = {
            showButtons : false
        };
        this._handleClick = this._handleClick.bind(this);
        this._handleButtonChange = this._handleButtonChange.bind(this);
    }

    _handleClick(event, payload, text){
        this.props.replyClick(event, payload, text);
        this._handleButtonChange();
        console.log('Buttons : '+this.state.showButtons);
    }

    _handleButtonChange(){
        this.setState({ 
            showButtons: !this.state.showButtons
            });
    }

    renderQuickReply(reply, i){
        if(!this.state.showButtons){
            return <QuickReply key={i} click={this._handleClick} reply = {reply}/>
        }
    }
    // componentDidMount(){
    //     if(this.state.showButtons){
    //         this.setState({ showButtons: false});
    //     }
    // }

    
    
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
                <span className = 'button-options' >
                    {this.renderQuickReplies(this.props.payload)}
                </span>
            </div>
        )
    };

}

export default QuickReplies;