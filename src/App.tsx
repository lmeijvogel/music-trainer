import './App.css';
import styled from 'styled-components';
import { SingleNoteTest } from './prompts/singleNote/SingleNoteTest';
import { useState } from 'react';
import { FretboardTest } from './prompts/fretboard/FretboardTest';

type Category = "singleNote" | "fretboard";

function App() {
    const [category, setCategory] = useState<Category>("fretboard");

    return (
        <div className="App">
            <MenuBar>
                <MenuItem>
                    <Button active={category === "singleNote"} onClick={() => setCategory("singleNote")}>Single note</Button>
                </MenuItem>
                <MenuItem>
                    <Button active={category === "fretboard"} onClick={() => setCategory("fretboard")}>Fretboard</Button>
                </MenuItem>
            </MenuBar>

            {category === "singleNote" ? (
                <SingleNoteTest />
            ) : <>
                <FretboardTest />
            </>}
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
