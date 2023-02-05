import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function Item(props) {
    var id = props.item._id;
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{props.item.name}</Card.Title>
                    <Card.Text>
                    {props.item.url}
                    </Card.Text>
                    <Button onClick={()=> {props.handler(id)}}>Remove</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Item;