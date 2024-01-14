import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { SingleNoteStave } from "../SingleNoteStave";
import { ClickableSection, ClickedFretMarker, FretboardSvg, WithClickedFretList } from "./Fretboard";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { FretboardPrompt } from "./FretboardPrompt";
import { HardLink } from "../../HardLink";
import { ErrorDisplay } from "../../ErrorDisplay";
import { displayedFretCount, fretMarkerDistance, fretMarkerRadius, fullScaleLength, paddingLeft, stringDistance, strings } from "./constants";
import { calculateFretPosition } from "./calculateFretPosition";
import styled from "styled-components";
import { BaseFretboard } from "./BaseFretboard";

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

    const [clickedFrets, addClickedFret, clearClickedFrets] = WithClickedFretList();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const onAppClick = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const onSubmitInput = useCallback((input: string, stringNumber: number, fretNumber: number) => {
        const check = prompt.check(input);

        if (check) {
            addClickedFret({
                stringNumber,
                fretNumber,
                result: "bad"
            });
            setErrorMessage(check);
        } else {
            addClickedFret({
                stringNumber,
                fretNumber,
                result: "good"
            });

            if (!testSpec) setPrompt(promptGenerator.next());
            setErrorMessage(undefined);
        }
    }, [prompt, promptGenerator, addClickedFret, testSpec]);

    const lastFretX = calculateFretPosition(displayedFretCount, fullScaleLength);
    const maxStringX = paddingLeft + lastFretX;

    const viewBox = `0 0 ${maxStringX + 10} ${stringDistance * strings.length + fretMarkerDistance + fretMarkerRadius * 2 + 10}`;

    return (<div tabIndex={0} onClick={onAppClick}>
        <ErrorDisplay text={errorMessage} />
        <SingleNoteStave prompt={prompt} />

        <FretboardSvg viewBox={viewBox}>
            <ClickableSection startFret={prompt.startFret ?? 0} endFret={prompt.endFret ?? displayedFretCount} onFretClick={onSubmitInput} />

            <ClickedFretsGroup>
                {clickedFrets.map(clickedFret => <ClickedFretMarker key={clickedFret.id} clickedSquare={clickedFret} afterFadeout={clearClickedFrets} />)}
            </ClickedFretsGroup>
            <BaseFretboard />
        </FretboardSvg>

        <HardLink prompt={prompt} onClick={setTestSpec} />
    </div>
    );
}

const ClickedFretsGroup = styled.g``;
