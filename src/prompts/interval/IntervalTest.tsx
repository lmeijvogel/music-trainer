import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { InputField } from "../../InputField";
import { IntervalPromptGenerator } from "./IntervalPromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { ResponseButtons } from "./ResponseButtons";
import { IntervalPrompt } from "./IntervalPrompt";
import { HardLink } from "../../HardLink";
import { useMobileDisplay } from "../../hooks/useMobileDisplay";
import { ErrorDisplay } from "../../ErrorDisplay";

export const IntervalTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const isMobileDisplay = useMobileDisplay();

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
        if (!isMobileDisplay) inputRef.current?.focus();
    }, [inputRef, isMobileDisplay]);

    const onSubmitInput = useCallback((input: string) => {
        const check = prompt.check(input);
        if (check) {
            setErrorMessage(check);
        } else {
            setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
        }
    }, [prompt, promptGenerator]);

    return (<TestContainer tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />

        <ResponseButtons onClick={onSubmitInput} />
        {isMobileDisplay ? null : <InputField ref={inputRef} onSubmit={onSubmitInput} />}
    </TestContainer>
    );
}

const TestContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
