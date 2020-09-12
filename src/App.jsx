import React, { useReducer } from 'react';
import './App.css';

import data from './cambridge_fy2021.json';



function build(groups, i, remaining, dispatch) {
    const grp = groups.shift();
    const style = i % 2 ? {
        height: `${grp.total/remaining*100}%`,
        left: 0,
        right: 0,
        top: 0,
    } : {
        width: `${grp.total/remaining*100}%`,
        top: 0,
        bottom: 0,
        left: 0,
    };

    const pieces = [
        <div style={{...style, position: 'absolute'}} className="box" onClick={() => dispatch({ type: 'PUSH', payload: grp.name })}>
          {grp.name}
        </div>
    ];
    if (groups.length) {
        const style = i % 2 ? {
            height: `${100 - grp.total/remaining*100}%`,
            left: 0,
            right: 0,
            bottom: 0,
        } : {
            width: `${100 - grp.total/remaining*100}%`,
            top: 0,
            bottom: 0,
            right: 0,
        };
        pieces.push(
            <div style={{
                position: 'absolute',
                ...style
            }}>
              {build(groups, i+1, remaining-grp.total, dispatch)}
            </div>
        );
    }
    return pieces;
}

function reducer(state, action) {
    switch (action.type) {
    case 'PUSH':
        return [...state].concat(action.payload);
    case 'POP':
        return state.slice(0, -1);
    case 'GOTO':
        return action.payload;
    default:
        return state;
    }
}

function App() {
    const [nav, dispatch] = useReducer(reducer, null, () => ([]));

    const level = nav.reduce((d, l) => d.groups[l], data);
    const {groups, total} = level;

    const sorted = Object.values(groups).sort().reverse();

  return (
    <div className="App">
      <header className="App-header">
        <div>{nav.map((txt, i) =>
                      <div className="breadcrumb" onClick={() => dispatch({ type: 'GOTO', payload: nav.slice(0, i+1) })}>{txt}</div>
                     )}</div>
        <div style={{ width: 400, height: 300, position: 'relative' }} className="box">
          {build(sorted, 0, total, dispatch)}
        </div>
      </header>
    </div>
  );
}

export default App;
