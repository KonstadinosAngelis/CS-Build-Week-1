import React, {useState} from 'react';
import Gamebox from './components/Gamebox'
import './App.css';

function App() {
    const [generations, setGenerations] = useState(0)
    const [columns, setColumns] = useState(25)
    const [rows, setRows] = useState(25)
    const [boxGrid, setBoxGrid] = useState(Array(rows).fill().map(() => Array(columns).fill(false)))

    const selectBox = (row, col) => {
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))
        gridCopy[row][col] = !gridCopy[row][col];
        setBoxGrid(gridCopy)
    }

  return (
    <div>
        <h1>Game of Life</h1>
        <Gamebox rows={rows} columns={columns} boxFull={boxGrid} selectBox={selectBox}/>
        <h2>{generations}</h2>
    </div>
  );
}

export default App;
