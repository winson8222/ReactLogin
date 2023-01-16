import React, { useState } from "react";
import MaterialTable from "@material-table/core"

function ShoppingList(props){

    const testlist = [
        {item: "tester1", url:"randomlink"},
    ]
    const [tabledata, setTableData] = useState(testlist);
    //examples:
    const list = [
        {title: "Item", field:"item"},
        {title: "URL", field:"url"}
    ]
    return(
        <div className="itemlist">
            <MaterialTable columns={list} data={tabledata}/>
        </div>
    )
}

export default ShoppingList;