import './App.css';
import styled from 'styled-components';
import { SingleNoteTest } from './prompts/singleNote/SingleNoteTest';
import { useCallback, useState } from 'react';
import { FretboardTest } from "./prompts/fretboard/FretboardTest";
import { IntervalTest } from './prompts/interval/IntervalTest';
import { parseLocationBar } from './helpers/locationBarHelpers';
import { HamburgerIcon } from './HamburgerIcon';

type Category = "singleNote" | "fretboard" | "interval";

const defaultCategory: Category = "fretboard";

function App() {
    const testSpec = parseLocationBar(window.location);

    const [menuBarShown, setMenuBarShown] = useState(false);

    const [category, setCategory] = useState<Category>(testSpec?.type || defaultCategory);

    const showMenuBar = useCallback(() => setMenuBarShown(true), [setMenuBarShown]);
    const hideMenuBar = useCallback(() => setMenuBarShown(false), [setMenuBarShown]);
    return (
        <div className="App">
            {menuBarShown ?
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
                </MenuBar> : <HamburgerIcon onClick={showMenuBar} />}

            <div className="canvas" onClick={hideMenuBar}>
                {category === "singleNote" ? (
                    <SingleNoteTest />
                ) : (category === "fretboard" ? <FretboardTest /> : <IntervalTest />)
                }
            </div>
        </div >
    );
}

const MenuBar = styled.ul`
    position: fixed;
    width: 100%;

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
