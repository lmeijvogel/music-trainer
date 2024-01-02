import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { Prompt } from "../Prompt";
import { SingleNoteStave } from "../SingleNoteStave";
import { Fretboard } from "./Fretboard";
import { ErrorDisplay } from "../../ErrorDisplay";

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
        const check = prompt.check(input);

        if (check) {
            setErrorMessage(check);
            return "bad";
        } else {
            setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
            return "good";
        }
    }, [prompt, promptGenerator]);

    return (<div tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />
        <Fretboard onNoteClick={onSubmitInput} />
    </div>
    );
}
