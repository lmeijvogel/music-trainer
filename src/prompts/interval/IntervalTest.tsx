import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { InputField } from "../../InputField";
import { IntervalPromptGenerator } from "./IntervalPromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { ResponseButtons } from "./ResponseButtons";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { IntervalPrompt } from "./IntervalPrompt";
import { HardLink } from "../../HardLink";
import { useMobileDisplay } from "../../hooks/useMobileDisplay";
import { ErrorDisplay } from "../../ErrorDisplay";
import { findNextPrompt } from "../../helpers/promptGeneratorHelpers";

export const IntervalTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [testSpec, setTestSpec] = useState<TestSpec | undefined>(parseLocationBar(window.location));
    const isMobileDisplay = useMobileDisplay();

    const promptGenerator = useMemo(() => new IntervalPromptGenerator(
        "E3",
        "A5"
    ), []);

    const [prompt, setPrompt] = useState<Prompt>(testSpec?.type === "interval" ? IntervalPrompt.fromTestSpec(testSpec) : findNextPrompt(promptGenerator.makeRandomPrompt, undefined));

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
            if (!testSpec) setPrompt(findNextPrompt(promptGenerator.makeRandomPrompt, prompt));
            setErrorMessage(undefined);
        }
    }, [prompt, promptGenerator, testSpec]);

    // The space in the empty error message is to ensure that it takes up its
    // vertical space even if it's visible
    return (<TestContainer tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />

        <ResponseButtons onClick={onSubmitInput} />
        {isMobileDisplay ? null : <InputField ref={inputRef} onSubmit={onSubmitInput} />}
        <HardLink prompt={prompt} onClick={setTestSpec} />
    </TestContainer>
    );
}

const TestContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
