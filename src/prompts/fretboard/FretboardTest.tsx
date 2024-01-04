import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { SingleNoteStave } from "../SingleNoteStave";
import { Fretboard } from "./Fretboard";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { FretboardPrompt } from "./FretboardPrompt";
import { HardLink } from "../../HardLink";
import { ErrorDisplay } from "../../ErrorDisplay";

const keys = ["C", "F", "Bb", "Eb", "G", "D", "A", "E"];

export const FretboardTest = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [testSpec, setTestSpec] = useState<TestSpec | undefined>(parseLocationBar(window.location));

    const promptGenerator = useMemo(() => new FretboardPromptGenerator(
        keys,
        "E3",
        "A5",
    ), []);

    const [prompt, setPrompt] = useState<FretboardPrompt>(testSpec?.type === "fretboard" ? FretboardPrompt.fromTestSpec(testSpec) : promptGenerator.next());

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
            if (!testSpec) setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
            return "good";
        }
    }, [prompt, promptGenerator, testSpec]);

    return (<div tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />
        <Fretboard onNoteClick={onSubmitInput} startFret={prompt.startFret} endFret={prompt.endFret} />

        <HardLink prompt={prompt} onClick={setTestSpec} />
    </div>
    );
}
