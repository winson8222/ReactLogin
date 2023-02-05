import React, { useEffect, useState } from "react";
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import Item from "./Item"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function ShoppingList(props){
    const { changeContent } = useContext(UserContext);
    const [name, setName] = useState("");
    const [url, setURL] = useState("");
    const [img, setImg] = useState("");

  

    async function handleAdd(){
        const itemAdded = {
            _id: Date.now(),
            name: name,
            url: url,
        }

        var newTable = await changeContent("ADD", itemAdded);
        setTableData(newTable);
        
    }

    async function handleRemove(id){
        var newTable = await changeContent("DELETE", id);
        setTableData(newTable);
    }


    const testlist = [
        {name: "tester1", url:"randomlink"},
    ]

    const testlist2 = [
        {name: "2121212", url:"randomlink"},
    ]
    const [tabledata, setTableData] = useState(testlist);
    //examples:

    //can use context fetch data instead
    useEffect(() =>{
        async function settingData() {
            const Items = await props.getItems();
            setTableData(Items);
            
        }
        
        settingData();
    }, []);


    
    return(
        <div className="itemlist">
            {tabledata.map((data) =>
            <Item key={data._id} item={data} handler={handleRemove}/>)}
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Item Name"/>
            <input value={url} onChange={(e) => {setURL(e.target.value)}} type="text" placeholder="URL" />
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}

export default ShoppingList;