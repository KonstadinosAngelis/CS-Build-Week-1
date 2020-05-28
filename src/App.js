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
    }

    //Board size control State
    const [length, setLength] = useState(columns)
    const [height, setHeight] = useState(rows)

    const setBoard = () => {
        setRows(length)
        setColumns(height)
        setBoxGrid(Array(length).fill().map(() => Array(height).fill(false)))
    }

    //Function to completely reset all settings
    const clear = () => {
        setGenerations(0);
        setButtonState(false);
        setColumns(25);
        setRows(25);
        setLength(25);
        setHeight(25);
        setBoxGrid(Presets.blank);
        setHistory({
            0: Presets.blank
        })
    }

    //Seed function that will randomly create a starting scenario
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

    //Functions to step forward/backward a single generation
    const incrementGen = () => {
        if (history[generations + 1]) {
            if (setBoxGrid(history[generations + 2])) {
                setBoxGrid(history[generations + 2])
                setGenerations(generations + 1)
            } else {
                setBoxGrid(history[generations + 1])
                setGenerations(generations + 1)
            }
        } else {
            play();
        }
    }

    const decrementGen = () => {
        if (generations > 0) {
            if (generations === 1 || generations === 0) {
                console.log("test")
                setGenerations(generations - 1)
                setBoxGrid(Presets.blank)
            } else {
                setGenerations(generations - 1)
                setBoxGrid(history[generations - 2])
            }
        }
    }

    //State to hold the history of generations
    const [history, setHistory] = useState({
        0: Presets.blank
    })

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
        setGenerations(generations + 1);


        if (isEmpty === false) {
            setButtonState(false)
            return
        }
        setHistory({
            ...history,
            [generations]: gridCopy
        })
        //Set the grid state to the new grid
        setBoxGrid(gridCopy);
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
                <div className="mainButtonDivs">
                    <button className="mainButtons" onClick={() => setButtonState(!buttonState)}>{buttonState === false ? "Play" : "Pause"}</button>
                    <button className="mainButtons" onClick={() => { setSpeed(400) }}>Slow Down</button>
                    <button className="mainButtons" onClick={() => { setSpeed(100) }}>Normal</button>
                    <button className="mainButtons" onClick={() => { setSpeed(1) }}>Fast</button>
                    <button className="mainButtons" onClick={() => clear()}>Clear</button>

                </div>
                <div className="controlDiv">
                    <h3>Board Controls</h3>
                    <div className="controlsWrapper">
                        <button className="controlsButtons" onClick={() => setLength(length - 1)}>-</button>
                        <h4>{`Current Length: ${length}`}</h4>
                        <button className="controlsButtons" onClick={() => setLength(length + 1)}>+</button>
                    </div>

                    <div className="controlsWrapper">
                        <button className="controlsButtons" onClick={() => setHeight(height - 1)}>-</button>
                        <h4>{`Current Height: ${height}`}</h4>
                        <button className="controlsButtons" onClick={() => setHeight(height + 1)}>+</button>
                    </div>
                    <div className="boardControlDiv">
                        <button className="resetDimensionButton" onClick={() => setBoard()}>Set</button>
                        <button className="resetDimensionButton" onClick={() => clear()}>Reset</button>
                    </div>
                </div>
                <div className="gameContent">
                    <div className="gamebox">
                        <Gamebox rows={rows} columns={columns} boxFull={boxGrid} selectBox={selectBox} />
                        <div className="generationsControl">
                            <button className="generationCtrlButton" onClick={() => { decrementGen() }}>Prev</button>
                            <h2>{`Generations: ${generations}`}</h2>
                            <button className="generationCtrlButton" onClick={() => { incrementGen() }}>Next</button>
                        </div>
                    </div>
                    <div className="preSelectButtonsDiv">
                        <button className="preSelectButtons" onClick={() => { clear(); setBoxGrid(Presets.Pentadecathlon) }}>Pentadecathlon</button>
                        <button className="preSelectButtons" onClick={() => { clear(); setBoxGrid(Presets.Pulsar) }}>Pulsar</button>
                        <button className="preSelectButtons" onClick={() => { clear(); setBoxGrid(Presets.Butterfly) }}>Butterfly</button>
                        <button className="preSelectButtons" onClick={() => { clear(); setBoxGrid(Presets.Interesting) }}>Interesting</button>
                        <button className="preSelectButtons" onClick={() => { clear(); seed() }}>Randomize</button>
                    </div>
                </div>
            <div className="rulesDiv">
                <h2 className="ruleHeader">The game</h2>
                <p className="rulesText">
                The Game of Life is not your typical computer game. It is a 'cellular automaton', and was invented by Cambridge mathematician John Conway.<br></br><br></br>

                This game became widely known when it was mentioned in an article published by Scientific American in 1970. It consists of a collection of cells which, based on a few mathematical rules, can live, die or multiply. Depending on the initial conditions, the cells form various patterns throughout the course of the game.   
                </p>

                <h2 className="ruleHeader">The rules</h2>
                <p className="rulesText"><u>For each cell that is populated:</u><br></br>
                Each cell with one or no neighbors dies, as if by solitude.<br></br>
                Each cell with four or more neighbors dies, as if by overpopulation.<br></br>
                Each cell with two or three neighbors survives.<br></br></p>

                <p className="rulesText"><u>For a space that is 'empty' or 'unpopulated'</u><br></br>
                Each cell with three neighbors becomes populated.
                </p>

                <h2 className="ruleHeader">The controls</h2>
                <p className="rulesText">
                Choose a figure from the pull-down menu or make one yourself by clicking on the cells with a mouse. A new generation of cells (corresponding to one iteration of the rules) is initiated by the 'Next' button. The 'Start' button advances the game by several generations. Game speed is regulated by the speed dial and the size of the cells with the size dial.
                </p>
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