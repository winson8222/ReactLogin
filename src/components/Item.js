import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context';

function Item(props) {
    var id = props.item._id;
    return (
        <div style={{width: "50%"}}>
            <div>
                <h3>Item: {props.item.name}</h3>
                <h2><small>URL:{props.item.url}</small></h2>
            </div>
            <button onClick={()=> {props.handler(id)}}>Remove</button>
        </div>
    );
}

export default Item;