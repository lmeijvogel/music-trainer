import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputField } from "../../InputField";
import { SingleNotePromptGenerator } from "./SingleNotePromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { SingleNotePrompt } from "./SingleNotePrompt";
import { HardLink } from "../../HardLink";
import { useMobileDisplay } from "../../hooks/useMobileDisplay";
import { ErrorDisplay } from "../../ErrorDisplay";
import { NoteButtons } from "./NoteButtons";
import styled from "styled-components";
import { findNextPrompt } from "../../helpers/promptGeneratorHelpers";
import { noop } from "../../helpers/noop";

export const SingleNoteTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [testSpec, setTestSpec] = useState<TestSpec | undefined>(parseLocationBar(window.location));

    const isMobileDisplay = useMobileDisplay();

    const promptGenerator = useMemo(() => new SingleNotePromptGenerator(
        "E3",
        "A5"
    ), []);

    const [prompt, setPrompt] = useState<Prompt>(testSpec?.type === "singleNote" ? SingleNotePrompt.fromTestSpec(testSpec) : findNextPrompt(promptGenerator.makeRandomPrompt, undefined));

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        if (!isMobileDisplay) inputRef.current?.focus();
    }, [inputRef, isMobileDisplay]);

    const onAppClick = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const onSubmitInput = useCallback((input: string) => {
        const check = prompt.check(input);
        if (check) {
            setErrorMessage(check);
        } else {
            if (!testSpec) setPrompt(findNextPrompt(promptGenerator.makeRandomPrompt, prompt));
            setErrorMessage(undefined);
        }
    }, [prompt, promptGenerator, testSpec]);

    return (<TestContainer tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} onKeyChange={noop} />

        {isMobileDisplay ? <NoteButtons keySignature={prompt.keySignature} onSubmit={onSubmitInput} /> : <InputField ref={inputRef} onSubmit={onSubmitInput} validator={(note: string) => !!note.match(/[A-Ga-g]/)} />}
        <HardLink prompt={prompt} onClick={setTestSpec} />
    </TestContainer>
    );
}

const TestContainer = styled.div`
    width: 100%;
`;
