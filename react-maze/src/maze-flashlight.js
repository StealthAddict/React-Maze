// TODO: implement flashlight as a class

// Innards:
// const mouseRef = useRef();
// const onMouseMoveHandler = useCallback ((e) => {
//     const x = e.clientX - document.documentElement.clientWidth;
//     const y = e.clientY - document.documentElement.clientHeight;
//     mouseRef.current.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    
// }, [mouseRef]);

    // useEffect(() => {
//     window.addEventListener('mousemove', onMouseMoveHandler);
//     return () => {
//         window.removeEventListener('mousemove', onMouseMoveHandler);
//     }
// }, [onMouseMoveHandler]);

// Return value:
// {/* <div className='flashlight' ref={mouseRef} /> */}




/* EXTRA: Cursor flashes then disappears
const delay = ms => new Promise(res => setTimeout(res, ms));
const setSquareBg = (idx, color) => { if (singleRef.current[idx] !== null){singleRef.current[idx].style.backgroundColor = color} }
const flashSquare = async(idx) => { setSquareBg(idx, 'white'); await delay(200); setSquareBg(idx, 'transparent'); }

Example Placement...
 case 39:    // Right
    if (prevCol < COLUMN_MAX - 1  && (singleRef.current[(prevRow * ROW_MAX) + prevCol].style.borderRightColor === 'transparent')){ 
        nextCol = prevCol + 1;
        setCurrCol(nextCol); 
    }
    flashSquare((nextRow*ROW_MAX + nextCol));
    break;
*/