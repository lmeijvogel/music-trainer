import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { InputField } from "../../InputField";
import { IntervalPromptGenerator } from "./IntervalPromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";

export const IntervalTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new IntervalPromptGenerator(
        ["C", "F", "Bb", "Eb", "G", "D", "A", "E"],
        "E3",
        "A5"
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
        const check = prompt.check(input);
        if (check) {
            setErrorMessage(check);
        } else {
            setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
        }
    }, [prompt, promptGenerator]);

    return (<div tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay visible={!!errorMessage}>{errorMessage ?? " "}</ErrorDisplay>
        <SingleNoteStave prompt={prompt} />

        <InputField ref={inputRef} onSubmit={onSubmitInput} />
    </div>
    );
}

const ErrorDisplay = styled.div<{ visible: boolean; }>`
    background-color: red;
    color: black;
    visibility: ${(props) => props.visible ? "visible" : "hidden"};
`;

