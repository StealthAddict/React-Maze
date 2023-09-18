import React, { useState, useEffect, useCallback, useRef } from 'react';

function MazeMain(props) {

    // --- MAZE COMPOSITION ---
    const ROW_MAX = 20;
    const COLUMN_MAX = 20;
    const exit = (ROW_MAX * COLUMN_MAX) - 1;
    const grid = [];
    const singleRef = useRef([]);
    const [start, setStart] = useState(false);
    
    // USER LOCATION
    const [currRow, setCurrRow] = useState(0);
    const [currCol, setCurrCol] = useState(0);
        
   
    for (var r = 0; r < ROW_MAX; r++){
        const currRow = [];
        for (var c = 0; c < COLUMN_MAX; c++){
            currRow.push(<div />);
        }
        grid.push(currRow);
    }

    const htmlGrid = (<tbody>
        {grid.map( (row, rowId) => {
            return (
                <tr className='maze-row' key={rowId}> 
                    {row.map( (col, colId) => {
                        return (
                            <td className={'maze-cell'} key={colId} ref={el => singleRef.current[(rowId * ROW_MAX) + colId] = el}></td>
                        )
                    })}
                </tr>
            )
        })}
        </tbody> );
    
    
    const cellExists = useCallback((cellIdx) => {
        if (cellIdx < 0 || cellIdx >= (ROW_MAX * COLUMN_MAX)){
            return false;
        }
        return true;
    }, [ROW_MAX, COLUMN_MAX])

    const getNeighbors = useCallback((cellIdx, cellGroup) => {
        var neighbors = [];
        if (cellExists(cellIdx + 1) && !cellGroup.includes(cellIdx + 1) && (cellIdx + 1) % ROW_MAX !== 0){ neighbors.push(cellIdx + 1) } // right
        if (cellExists(cellIdx - 1) && !cellGroup.includes(cellIdx - 1) && cellIdx % ROW_MAX !== 0){ neighbors.push(cellIdx - 1) } // left
        if (cellExists(cellIdx + ROW_MAX) && !cellGroup.includes(cellIdx + ROW_MAX)){ neighbors.push(cellIdx + ROW_MAX) } // down
        if (cellExists(cellIdx - ROW_MAX) && !cellGroup.includes(cellIdx - ROW_MAX)){ neighbors.push(cellIdx - ROW_MAX) } // up
        return neighbors;
    }, [ROW_MAX, cellExists])

    /* Change the borders between mainCell & minorCell to be transparent.
       Direction is in relation to mainCell. */
    const removeBorder = useCallback((mainCell, minorCell, direction) => {
        switch (direction){
            case 0: // North 
                singleRef.current[mainCell].style.borderTopColor = 'transparent';
                singleRef.current[minorCell].style.borderBottomColor = 'transparent';
                break;
            case 1: // South
                singleRef.current[mainCell].style.borderBottomColor = 'transparent';
                singleRef.current[minorCell].style.borderTopColor = 'transparent';
                break;
            case 2: // East
                singleRef.current[mainCell].style.borderRightColor = 'transparent';
                singleRef.current[minorCell].style.borderLeftColor = 'transparent';
                break;
            case 3: // West
                singleRef.current[mainCell].style.borderLeftColor = 'transparent';
                singleRef.current[minorCell].style.borderRightColor = 'transparent';
                break;
            default:
                break;
        }
    }, [singleRef])

    const [mazePath, setMazePath] = useState([0]);
    const resetMaze = useCallback(() => {
        mazePath.forEach((e) => {singleRef.current[e].style.borderColor = 'white';});

        // Reset cursor
        singleRef.current[currRow*ROW_MAX + currCol].style.backgroundColor = 'transparent';
        setCurrRow(0);
        setCurrCol(0);
        setStart(false);
        
    }, [currCol, currRow, setCurrCol, setCurrRow, setStart, mazePath]);

    /* Builds the maze with Prim's algorithm. */
    const buildMaze = useCallback(() => {
        var mazePathway = [0];
        if (!start){
            while (mazePathway.length < (ROW_MAX * COLUMN_MAX)){                
                // Get all potential neighbors
                var currNeighbors = [];
                for (var i = 0; i < mazePathway.length; i++){
                    const res = getNeighbors(mazePathway[i], mazePathway);
                    currNeighbors = currNeighbors.concat(res);
                }

                // Select a random edge and check if belongs within mazePathway, then remove borders if so.
                const nextCell = currNeighbors[Math.floor(Math.random() * currNeighbors.length)];
                var adjCell = nextCell;
                var edgeReplaced = false;
                while (!edgeReplaced){
                    var edge = Math.floor(Math.random() * 4);
                    switch (edge) {
                        case 0: // North border
                            if (mazePathway.includes(nextCell - ROW_MAX)){
                                adjCell = nextCell - ROW_MAX;
                                removeBorder(nextCell, adjCell, 0);
                                edgeReplaced = true;
                            }
                            break;
                        case 1: // South border
                            if (mazePathway.includes(nextCell + ROW_MAX)){
                                adjCell = nextCell + ROW_MAX;
                                removeBorder(nextCell, adjCell, 1);
                                edgeReplaced = true;
                            } 
                            break;
                        case 2: // East border
                            if (mazePathway.includes(nextCell + 1) && (nextCell + 1) % ROW_MAX !== 0){
                                adjCell = nextCell + 1;
                                removeBorder(nextCell, adjCell, 2);
                                edgeReplaced = true;
                            } 
                            break;
                        case 3: // West border
                            if (mazePathway.includes(nextCell - 1) && nextCell % ROW_MAX !== 0){
                                adjCell = nextCell - 1;
                                removeBorder(nextCell, adjCell, 3);
                                edgeReplaced = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
                mazePathway.push(nextCell);
            }
            singleRef.current[exit].style.borderRightColor = 'transparent';
            singleRef.current[0].style.backgroundColor = 'white';
            setMazePath(mazePathway);
            console.log(mazePathway);
        }
    }, [start, getNeighbors, removeBorder, exit, setMazePath])
    
    useEffect ( () => {
        buildMaze();
    }, [buildMaze]);

    // -- MOVEMENT --
    const onKeyHandler = useCallback ((e) => {
        const setSquareBg = (idx, color) => { if (singleRef.current[idx] !== null){singleRef.current[idx].style.backgroundColor = color} }

        const [prevRow, prevCol] = [currRow, currCol];
        var [nextRow, nextCol] = [prevRow, prevCol];

        setSquareBg(currRow*ROW_MAX + nextCol, 'transparent')
        switch (e.keyCode) {            
            case 37:    // Left  
                if (prevCol > 0 && (singleRef.current[(prevRow * ROW_MAX) + prevCol].style.borderLeftColor === 'transparent')){ 
                    nextCol = prevCol - 1;
                    setCurrCol(nextCol); 
                }
                break;
            case 39:    // Right
                if (prevCol < COLUMN_MAX - 1  && (singleRef.current[(prevRow * ROW_MAX) + prevCol].style.borderRightColor === 'transparent')){ 
                    nextCol = prevCol + 1;
                    setCurrCol(nextCol); 
                }
                break;
            case 38:    // Up
                if (prevRow > 0  && (singleRef.current[(prevRow * ROW_MAX) + prevCol].style.borderTopColor === 'transparent')){ 
                    nextRow = prevRow - 1;
                    setCurrRow(nextRow); 
                }
                break;
            case 40:    // Down
                if (prevRow < ROW_MAX - 1  && (singleRef.current[(prevRow * ROW_MAX) + prevCol].style.borderBottomColor === 'transparent')){ 
                    nextRow = prevRow + 1;
                    setCurrRow(nextRow); 
                }
                break;
            default:
                break;
        }
        setSquareBg((nextRow*ROW_MAX + nextCol), 'white');

        // WIN CONDITION
        if ((currRow * ROW_MAX) + currCol === exit){
            resetMaze();
            buildMaze();
        }

        if (!start) {
            setStart(true);
        }
      }, [currRow, setCurrRow, currCol, setCurrCol, start, setStart, exit, buildMaze, resetMaze]);


    useEffect(() => {
        window.addEventListener("keydown", onKeyHandler);
        return () => {
          window.removeEventListener("keydown", onKeyHandler);
        };
    },[onKeyHandler]);    

    return (
        <div className='maze-body' style={{overflow: 'hidden',  position: 'relative'}}>
            <div className='grid-frame' style={{height: '100vh'}}>
                <div className='grid-cell no-cursor' style={{width: '50vh'}}>
                    <table> 
                       {htmlGrid}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MazeMain;