import React, { useState, useEffect, useRef } from 'react';
import Gamebox from './components/Gamebox'
import './App.css';
const Presets = require('./presets')

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
        console.log(boxGrid)
    }

    //Board size control State
    const [length, setLength] = useState(columns)
    const [height, setHeight] = useState(rows)

    const setBoard = () => {
        setRows(length)
        setColumns(height)
        setBoxGrid(Array(length).fill().map(() => Array(height).fill(false)))
    }

    const clear = () => {
        setBoxGrid(Presets.blank);
        setGenerations(0);
        setButtonState(false);
    }

    const resetDimensions = () => {
        setGenerations(0);
        setButtonState(false);
        setColumns(25);
        setRows(25);
        setLength(25);
        setHeight(25);
        setBoxGrid(Presets.blank);
    }

    const seed = () => {
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))
        gridCopy = Array(rows).fill().map(() => Array(columns).fill(false))
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        setBoxGrid(gridCopy)
    }

    //Function that the set timeout runs
    const play = () => {
        let currentGrid = boxGrid
        let gridCopy = JSON.parse(JSON.stringify(boxGrid))

        let isEmpty = false
        for (let rowInd = 0; rowInd < rows; rowInd++) {
            for (let columnInd = 0; columnInd < columns; columnInd++) {
                if (gridCopy[rowInd][columnInd]) {
                    isEmpty = true
                }
                //Keep track how many squares are true around it
                let count = 0

                //check left
                if (rowInd > 0) if (currentGrid[rowInd - 1][columnInd]) count++;
                //check upper-left
                if (rowInd > 0 && columnInd > 0) if (currentGrid[rowInd - 1][columnInd - 1]) count++;
                //check lower-left
                if (rowInd > 0 && columnInd < columns - 1) if (currentGrid[rowInd - 1][columnInd + 1]) count++;
                //check above
                if (columnInd > 0) if (currentGrid[rowInd][columnInd - 1]) count++;
                //check below
                if (columnInd < columns - 1) if (currentGrid[rowInd][columnInd + 1]) count++;
                //check right
                if (rowInd < rows - 1) if (currentGrid[rowInd + 1][columnInd]) count++;
                //check upper-right
                if (rowInd < rows - 1 && columnInd > 0) if (currentGrid[rowInd + 1][columnInd - 1]) count++;
                //check lower-right
                if (rowInd < rows - 1 && columnInd < columns - 1) if (currentGrid[rowInd + 1][columnInd + 1]) count++;

                //Checks agains the rules of the game to see if it should be set true or false
                if (currentGrid[rowInd][columnInd] && (count < 2 || count > 3)) gridCopy[rowInd][columnInd] = false;
                if (!currentGrid[rowInd][columnInd] && count === 3) gridCopy[rowInd][columnInd] = true;
            }
        }
        if (!isEmpty) {
            return
        }
        //Set the grid state to the new grid
        setBoxGrid(gridCopy);
        setGenerations(generations + 1);
    }
    const [buttonState, setButtonState] = useState(false)
    useInterval(() => {
        if (buttonState === true) {
            play()
        }
        else { return }
    }, speed)

    return (
        <div>
            <h1>Game of Life</h1>
            <button onClick={() => setButtonState(!buttonState)}>{buttonState === false ? "Play" : "Pause"}</button>
            <button onClick={() => { setSpeed(400) }}>Slow Down</button>
            <button onClick={() => { setSpeed(100) }}>Normal</button>
            <button onClick={() => { setSpeed(10) }}>Fast</button>
            <button onClick={() => clear()}>Clear</button>
            <div className="controlDiv">
                <h3>Board Controls</h3>
                <div className="controlsWrapper">
                    <button onClick={() => setLength(length - 1)}>-</button>
                    <h4>{`Current Length: ${length}`}</h4>
                    <button onClick={() => setLength(length + 1)}>+</button>
                </div>

                <div className="controlsWrapper">
                    <button onClick={() => setHeight(height - 1)}>-</button>
                    <h4>{`Current Height: ${height}`}</h4>
                    <button onClick={() => setHeight(height + 1)}>+</button>
                </div>
                <div className="boardControlDiv">
                    <button className="resetDimensionButton" onClick={() => setBoard()}>Set</button>
                    <button className="resetDimensionButton" onClick={() => resetDimensions()}>Reset</button>
                </div>
            </div>
            <div className="gameContent">
                <div className="gamebox">
                    <Gamebox rows={rows} columns={columns} boxFull={boxGrid} selectBox={selectBox} />
                    <div className="generationsControl">
                        <button className="generationCtrlButton">Prev</button>
                        <h2>{`Generations: ${generations}`}</h2>
                        <button className="generationCtrlButton">Next</button>
                    </div>
                </div>
                <div className="preSelectButtonsDiv">
                    <button className="preSelectButtons" onClick={() => setBoxGrid(Presets.Pentadecathlon)}>Pentadecathlon</button>
                    <button className="preSelectButtons" onClick={() => setBoxGrid(Presets.Pulsar)}>Pulsar</button>
                    <button className="preSelectButtons" onClick={() => setBoxGrid(Presets.Butterfly)}>Butterfly</button>
                    <button className="preSelectButtons" onClick={() => setBoxGrid(Presets.Interesting)}>Interesting</button>
                    <button className="preSelectButtons" onClick={() => seed()}>Randomize</button>
                </div>
            </div>
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