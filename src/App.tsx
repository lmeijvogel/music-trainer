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
            <header className="App-header">
                <Button onClick={() => setCategory("singleNote")}>Single note</Button>
                <Button onClick={() => setCategory("fretboard")}>Fretboard</Button>
            </header>

            {category === "singleNote" ? (
                <SingleNoteTest />
            ) : <>
                <FretboardTest />
            </>}
        </div >
    );
}

const Button = styled.button`
`;

export default App;
