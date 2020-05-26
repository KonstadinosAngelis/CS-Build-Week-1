import React, {useState} from 'react'

export default function Cells(props){
    const selectBox = () => {
        props.selectBox(props.row, props.column)
    }
    return(
        <div className={props.class} onClick={selectBox}>
            
        </div>
    )}