import React, {useState} from 'react';
import Gamebox from './components/Gamebox'
import './App.css';
import { createPortal } from 'react-dom';

function App() {
    const [generations, setGenerations] = useState(0)
    const [columns, setColumns] = useState(25)
    const [rows, setRows] = useState(25)
    const [boxGrid, setBoxGrid] = useState(Array(rows).fill().map(() => Array(columns).fill(false)))

    //Function that changes the grid when a box is selected
    const selectBox = (row, col) => {
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))
        gridCopy[row][col] = !gridCopy[row][col];
        setBoxGrid(gridCopy)
    }

    //Function that runs when the play button is pressed
    const play = () => {
        let currentGrid = boxGrid
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))

        for (let rowInd = 0; rowInd < rows; rowInd++){
            for (let columnInd = 0; columnInd < columns; columnInd++){
                //Keep track how many squares are true around it
                let count = 0 

                //check left
                if(rowInd > 0) if(currentGrid[rowInd - 1][columnInd]) count++;
                //check upper-left
                if(rowInd > 0 && columnInd > 0) if(currentGrid[rowInd - 1][columnInd - 1]) count++;
                //check lower-left
                if(rowInd > 0 && columnInd < columns - 1) if(currentGrid[rowInd - 1][columnInd + 1]) count++;
                //check above
                if(columnInd > 0) if(currentGrid[rowInd][columnInd - 1]) count++;
                //check below
                if(columnInd < columns - 1) if(currentGrid[rowInd][columnInd + 1]) count++;
                //check right
                if(rowInd < rows - 1) if(currentGrid[rowInd + 1][columnInd]) count++;
                //check upper-right
                if(rowInd < rows - 1 && columnInd > 0) if(currentGrid[rowInd + 1][columnInd - 1]) count++;
                //check lower-right
                if(rowInd < rows - 1 && columnInd < columns - 1) if(currentGrid[rowInd + 1][columnInd + 1]) count++;

                //Checks agains the rules of the game to see if it should be set true or false
                if(currentGrid[rowInd][columnInd] && (count < 2 || count > 3)) gridCopy[rowInd][columnInd] = false;
                if(!currentGrid[rowInd][columnInd] && count === 3) gridCopy[rowInd][columnInd] = true;
            }
        }
        //Set the grid state to the new grid
        setBoxGrid(gridCopy);
        setGenerations(generations+1);
    }

  return (
    <div>
        <h1>Game of Life</h1>
        <button onClick={()=> play()}>Play</button>
        <Gamebox rows={rows} columns={columns} boxFull={boxGrid} selectBox={selectBox}/>
        <h2>{generations}</h2>
    </div>
  );
}

export default App;