import React from 'react';
import Cells from './Cells'

export default function Gamebox(props){
    const width = props.columns * 16;
    
    let rowIndex = ""
    return(
        <div className="grid" style={{width: width}}> 
            {props.boxFull.map((row, index) => (
                rowIndex = index,
                row.map((box, index) => (
                    box === false ? <Cells class={"box dead"} selectBox={props.selectBox} key={`${rowIndex}_${index}`}row={rowIndex} column={index}/>:
                    <Cells class={"box alive"} selectBox={props.selectBox} key={`${rowIndex}_${index}`} row={rowIndex} column={index}/>
                ))
            ))}
        </div>
    )}