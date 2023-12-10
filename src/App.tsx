import './App.css';
import styled from 'styled-components';
import { SingleNoteTest } from './prompts/singleNote/SingleNoteTest';
import { useState } from 'react';
import { FretboardTest } from './prompts/fretboard/FretboardTest';
import { IntervalTest } from './prompts/interval/IntervalTest';

type Category = "singleNote" | "fretboard" | "interval";

function App() {
    const [category, setCategory] = useState<Category>("interval");

    return (
        <div className="App">
            <MenuBar>
                <MenuItem>
                    <Button active={category === "singleNote"} onClick={() => setCategory("singleNote")}>Single note</Button>
                </MenuItem>
                <MenuItem>
                    <Button active={category === "fretboard"} onClick={() => setCategory("fretboard")}>Fretboard</Button>
                </MenuItem>
                <MenuItem>
                    <Button active={category === "interval"} onClick={() => setCategory("interval")}>Interval</Button>
                </MenuItem>
            </MenuBar>

            {category === "singleNote" ? (
                <SingleNoteTest />
            ) : (category === "fretboard" ? <FretboardTest /> : <IntervalTest />)
            }
        </div >
    );
}

const MenuBar = styled.ul`
    display: flex;

    flex-direction: row;
    justify-content: center;

    margin: 0;

    padding: 6px 0 6px;

    background-color: #eeeeee;

    list-style-type: none;
`;

const MenuItem = styled.li`
    padding-left: 10px;
`;

const Button = styled.button<{ active: boolean }>`
    background-color: ${props => props.active ? "white" : "#dddddd"};
    border: 0px;
    padding: 8px;
`;

export default App;
