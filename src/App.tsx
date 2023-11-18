import './App.css';
import { Prompt, TestStave } from './TestStave';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { InputField } from './InputField';

const allNotes = ["E", "F", "G", "A", "B", "C", "D"];

const candidateNotes = buildCandidateNotes();

/**
 * Returns all (for now) relevant notes on guitar, from low E to A on the highest string
 */
function buildCandidateNotes(): string[] {
    let noteIndex = 0;
    let octave = 3;

    let noteAndOctave = "";

    const result = [];
    do {
        const note = allNotes[noteIndex % allNotes.length];

        if (note === "C") octave++;
        noteIndex++;

        noteAndOctave = `${note}${octave}`;

        result.push(noteAndOctave);
    } while (noteAndOctave !== "A5");

    return result;
}

function getNextPrompt(): Prompt {
    const randomIndex = Math.floor(Math.random() * candidateNotes.length);

    return {
        type: "single",
        note: candidateNotes[randomIndex]
    };
}

function toAnswerFormat(prompt: Prompt): string {
    if (prompt.type === "single")
        return prompt.note[0].toLowerCase();
    else
        return prompt.name;
}

function App() {
    const inputRef = useRef<HTMLInputElement>(null);

    const [prompt, setPrompt] = useState<Prompt>(getNextPrompt);

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onSubmitInput = useCallback((input: string) => {
        if (input === toAnswerFormat(prompt)) {
            setPrompt(getNextPrompt());
            setErrorMessage(undefined);
        } else {
            setErrorMessage(`Wrong, the note was ${toAnswerFormat(prompt)}.`);
        }


    }, [prompt]);

    const onAppClick = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    return (
        <div className="App" tabIndex={0} onClick={onAppClick}>
            <header className="App-header">
                <ErrorDisplay visible={!!errorMessage}>{errorMessage ?? " "}</ErrorDisplay>
                <TestStave prompt={prompt} keySignature={"C"} />

                <InputField ref={inputRef} onSubmit={onSubmitInput} validNotes={allNotes} />
            </header>
        </div >
    );
}

const ErrorDisplay = styled.div<{ visible: boolean; }>`
    background-color: red;
    color: black;
    visibility: ${(props) => props.visible ? "visible" : "hidden"};
`;

export default App;
