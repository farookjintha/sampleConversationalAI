import React, {Component} from 'react';

export default class Details extends React.Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            showDetails : false
        };
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails() {
        this.setState({ 
          showDetails: !this.state.showDetails
          });
      }

      render(){
          const { showDetails } = this.state;
          
          if(showDetails){
              console.log(showDetails);
              return(<div>
                <span className="info_icon minus_icon" 
                 onClick = {this.toggleDetails}>
                     <i className = 'zmdi zmdi-minus-circle-outline'></i>
                 </span>
                 <div className = 'show_details chat_converse'>
                    <p>Summary of the bot</p>
                    </div>
                    </div>
              );
          }else{
            console.log(showDetails);
              return(
                <span className="info_icon" 
                 onClick = {this.toggleDetails}>
                     <i className = 'zmdi zmdi-info-outline'></i>
                 </span>
              );
          }
      }


}
