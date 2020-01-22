import React from 'react';

const Cards = (props) =>{
    return(
        <div style={{  float: "left", width: 100, marginRight: 20 }}>
            <div className="card" style={{paddingTop: 10}}>
                <div className="card-image" style = {{width: 50, height: 50, margin: '0 auto'}}>
                    <img alt = {props.payload.fields.header.stringValue}src={props.payload.fields.image.stringValue} />
                    <span className="card-title">{props.payload.fields.header.stringValue}</span>
                </div>
                <div className="card-content" style={{fontSize: 15, textAlign: 'center'}}>
                    {props.payload.fields.description.stringValue}
                    <p><a href="/">{props.payload.fields.price.stringValue}</a></p>
                </div>
                <div className="card-action">
                    <a target = "_blank" href={props.payload.fields.link.stringValue}>Get Now</a>
                </div>
            </div>
        </div>
    );
};

export default Cards;
