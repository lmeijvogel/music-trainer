import './App.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { InputField } from './InputField';
import { PromptGenerator } from './PromptGenerator';
import { Prompt } from './prompts/Prompt';
import { SingleNoteStave } from './prompts/singleNote/SingleNoteStave';
import { SingleNotePrompt } from './prompts/singleNote/SingleNotePrompt';

function App() {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new PromptGenerator(["C", "F", "G"]), []);

    const [prompt, setPrompt] = useState<Prompt>(promptGenerator.next());

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onSubmitInput = useCallback((input: string) => {
        if (prompt.check(input)) {
            setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
        } else {
            setErrorMessage(`Wrong, the note was ${prompt.toString()}.`);
        }
    }, [prompt, promptGenerator]);

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
                {prompt instanceof SingleNotePrompt ?
                    <SingleNoteStave prompt={prompt} /> : null}

                <InputField ref={inputRef} onSubmit={onSubmitInput} validator={(note: string) => !!note.match(/[A-Ga-g]/)} />
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
