import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { correctForKey } from "../../helpers/correctForKey";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { Fretboard } from "./Fretboard";

const keys = ["C", "F", "Bb", "Eb", "G", "D", "A", "E"];

export const FretboardTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new FretboardPromptGenerator(
        keys,
        "E3",
        "A5",
    ), []);

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
            return "good";
        } else {
            setErrorMessage(`You answered ${correctForKey(input, prompt.keySignature)}, but the note is ${prompt.toString()}.`);
            return "bad";
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
    line-height: 1.5em;
    height: 1.5em;
    visibility: ${(props) => props.visible ? "visible" : "hidden"};
`;

