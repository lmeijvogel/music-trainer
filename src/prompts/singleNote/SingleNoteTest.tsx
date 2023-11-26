import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { InputField } from "../../InputField";
import { PromptGenerator } from "../../PromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNotePrompt } from "./SingleNotePrompt";
import { SingleNoteStave } from "../SingleNoteStave";

export const SingleNoteTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new PromptGenerator(["C", "F", "G"], (keySignature: string, note: string) => new SingleNotePrompt(keySignature, note)), []);

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

        <InputField ref={inputRef} onSubmit={onSubmitInput} validator={(note: string) => !!note.match(/[A-Ga-g]/)} />
    </div>
    );
}

const ErrorDisplay = styled.div<{ visible: boolean; }>`
    background-color: red;
    color: black;
    visibility: ${(props) => props.visible ? "visible" : "hidden"};
`;
