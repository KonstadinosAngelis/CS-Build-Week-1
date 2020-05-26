import React, {useState, useEffect, useRef} from 'react';
import Gamebox from './components/Gamebox'
import './App.css';

function App() {
    const [generations, setGenerations] = useState(0)
    const [speed, setSpeed] = useState(100)
    const [columns, setColumns] = useState(25)
    const [rows, setRows] = useState(25)
    const [boxGrid, setBoxGrid] = useState(Array(rows).fill().map(() => Array(columns).fill(false)))

    //Function that changes the grid when a box is selected
    const selectBox = (row, col) => {
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))
        gridCopy[row][col] = !gridCopy[row][col];
        setBoxGrid(gridCopy)
    }

    const clear = () => {
        setBoxGrid(Array(rows).fill().map(() => Array(columns).fill(false)));
        setGenerations(0);
        setButtonState(false);
    }

    const resetDimensions = () => {
        setBoxGrid(Array(rows).fill().map(() => Array(columns).fill(false)));
        setGenerations(0);
        setButtonState(false);
        setColumns(25);
        setRows(25);
    }

    //Function that the set timeout runs
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
    const [buttonState, setButtonState] = useState(false)
    useInterval(() => {
        if(buttonState == true){
            play()
        }
        else{return}
    }, speed)

  return (
    <div>
        <h1>Game of Life</h1>
    <button onClick={() => setButtonState(!buttonState)}>{buttonState === false ? "Play" : "Pause"}</button>
    <button onClick={() => clear()}>Clear</button>
    <div className="controlDiv">
        <h3>Board Controls</h3>
    <div className="controlsWrapper">
        <button>-</button>
        <h4>{`Current Height: ${columns}`}</h4>
        <button>+</button>
    </div>

    <div className="controlsWrapper">
        <button>-</button>
        <h4>{`Current Length: ${rows}`}</h4>
        <button>+</button>
    </div>
    <button className="resetDimensionButton" onClick={()=> resetDimensions()}>Reset</button>
    </div>
        <Gamebox rows={rows} columns={columns} boxFull={boxGrid} selectBox={selectBox}/>
        <h2>{`Generations: ${generations}`}</h2>
    </div>
  );
}

//Custom timeout hook
const useInterval = (callback, delay) => {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  
export default App;