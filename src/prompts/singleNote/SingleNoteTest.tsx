import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputField } from "../../InputField";
import { SingleNotePromptGenerator } from "./SingleNotePromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { ErrorDisplay } from "../../ErrorDisplay";

export const SingleNoteTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const promptGenerator = useMemo(() => new SingleNotePromptGenerator(
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
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />

        <InputField ref={inputRef} onSubmit={onSubmitInput} validator={(note: string) => !!note.match(/[A-Ga-g]/)} />
    </div>
    );
}
