import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { PromptGenerator } from "../../PromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { Fretboard } from "./Fretboard";
import { FretboardPrompt } from "./FretboardPrompt";

export const FretboardTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new PromptGenerator(["C", "F", "G"], (keySignature: string, note: string) => new FretboardPrompt(keySignature, note)), []);

    const [prompt, setPrompt] = useState<Prompt>(promptGenerator.next());

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const onAppClick = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const onSubmitInput = useCallback((input: string) => {
        if (prompt.check(input)) {
            setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
        } else {
            setErrorMessage(`Wrong, the note was ${prompt.toString()}.`);
        }
    }, [prompt, promptGenerator]);

    return (<div tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay visible={!!errorMessage}>{errorMessage ?? " "}</ErrorDisplay>
        <SingleNoteStave prompt={prompt} />
        <Fretboard onNoteClick={onSubmitInput} />
    </div>
    );
}

const ErrorDisplay = styled.div<{ visible: boolean; }>`
    background-color: red;
    color: black;
    visibility: ${(props) => props.visible ? "visible" : "hidden"};
`;

