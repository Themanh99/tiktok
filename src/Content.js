import React,{memo} from 'react';

function Content({onIncrease}) {
    console.log('re-render');
    return (
        <>
            <h2>Xin chao anh em</h2>
            <button onClick={onIncrease}>Click me!</button>
        </>
    );
}

export default memo(Content);