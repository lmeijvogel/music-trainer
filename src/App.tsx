import './App.css';
import styled from 'styled-components';
import { SingleNoteTest } from './prompts/singleNote/SingleNoteTest';
import { useState } from 'react';
import { FretboardTest } from './prompts/fretboard/FretboardTest';
import { IntervalTest } from './prompts/interval/IntervalTest';
import { parseLocationBar } from './helpers/locationBarHelpers';

type Category = "singleNote" | "fretboard" | "interval";

const defaultCategory: Category = "interval";

function App() {
    const testSpec = parseLocationBar(window.location);

    const [category, setCategory] = useState<Category>(testSpec?.type || defaultCategory);

    return (
        <div className="App">
            <MenuBar>
                <MenuItem>
                    <Button $isActive={category === "singleNote"} onClick={() => setCategory("singleNote")}>Single note</Button>
                </MenuItem>
                <MenuItem>
                    <Button $isActive={category === "fretboard"} onClick={() => setCategory("fretboard")}>Fretboard</Button>
                </MenuItem>
                <MenuItem>
                    <Button $isActive={category === "interval"} onClick={() => setCategory("interval")}>Interval</Button>
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

const Button = styled.button<{ $isActive: boolean }>`
    background-color: ${props => props.$isActive ? "white" : "#dddddd"};
    border: 0px;
    padding: 8px;
`;

export default App;
