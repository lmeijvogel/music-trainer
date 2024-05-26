import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { SingleNoteStave } from "../SingleNoteStave";
import { ClickedFretMarker, FretboardSvg, WithClickedFretList } from "./Fretboard";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { FretboardPrompt } from "./FretboardPrompt";
import { HardLink } from "../../HardLink";
import { ErrorDisplay } from "../../ErrorDisplay";
import {
    displayedFretCount,
    fretMarkerDistance,
    fretMarkerRadius,
    fullScaleLength,
    paddingLeft,
    stringDistance,
    strings
} from "./constants";
import { calculateFretPosition } from "./calculateFretPosition";
import styled from "styled-components";
import { BaseFretboard } from "./BaseFretboard";
import { findNextPrompt } from "../../helpers/promptGeneratorHelpers";
import { FretboardTestSettings } from "./FretboardTestSettings";
import { ClickableFretboardSection } from "./ClickableFretboardSection";
import { FretboardTestPreferencesDialog } from "./FretboardTestPreferencesDialog";

const defaultFretboardTestSettings: FretboardTestSettings = {
    strings: ["E5"],
    minPosition: 0,
    maxPosition: 0,
    keySignature: "C"
};

export const FretboardTest = () => {
    const [prefsDialogVisible, setPrefsDialogVisible] = useState(false);
    const [config, setConfig] = useState<FretboardTestSettings>(getConfigFromLocalStorage());

    const [testSpec, setTestSpec] = useState<TestSpec | undefined>(parseLocationBar(window.location));

    const promptGenerator = useMemo(() => new FretboardPromptGenerator(config), [config]);

    const [prompt, setPrompt] = useState<FretboardPrompt>(
        testSpec?.type === "fretboard"
            ? FretboardPrompt.fromTestSpec(testSpec)
            : findNextPrompt(promptGenerator.makeRandomPrompt, undefined)
    );

    const [clickedFrets, addClickedFret, clearClickedFrets] = WithClickedFretList();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        setPrompt(findNextPrompt(promptGenerator.makeRandomPrompt, undefined));
    }, [promptGenerator]);

    const onSubmitInput = useCallback(
        (input: string, stringNumber: number, fretNumber: number) => {
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

                if (!testSpec) setPrompt(findNextPrompt(promptGenerator.makeRandomPrompt, prompt));
                setErrorMessage(undefined);
            }
        },
        [prompt, promptGenerator, addClickedFret, testSpec]
    );

    const lastFretX = calculateFretPosition(displayedFretCount, fullScaleLength);
    const maxStringX = paddingLeft + lastFretX;

    const viewBox = `0 0 ${maxStringX + 10} ${stringDistance * strings.length + fretMarkerDistance + fretMarkerRadius * 2 + 10
        }`;

    const showPrefsDialog = () => setPrefsDialogVisible(true);

    const applyConfig = (newSettings: FretboardTestSettings) => {
        storeFretboardTestSettingsInLocalStorage(newSettings);

        setConfig(newSettings);

        setPrefsDialogVisible(false);
    };

    return (
        <>
            {prefsDialogVisible ? <FretboardTestPreferencesDialog initialSettings={config} allowedPositions={[0, 2, 4, 6, 8]} onSubmit={applyConfig} /> : null}
            <div>
                <ErrorDisplay text={errorMessage} />
                <div onClick={showPrefsDialog}>
                    <SingleNoteStave prompt={prompt} />
                </div>

                <FretboardSvg viewBox={viewBox}>
                    <ClickableFretboardSection
                        startFret={prompt.startFret ?? 0}
                        endFret={prompt.endFret ?? displayedFretCount}
                        strings={config.strings}
                        onFretClick={onSubmitInput}
                    />

                    <ClickedFretsGroup>
                        {clickedFrets.map((clickedFret) => (
                            <ClickedFretMarker
                                key={clickedFret.id}
                                clickedSquare={clickedFret}
                                afterFadeout={clearClickedFrets}
                            />
                        ))}
                    </ClickedFretsGroup>
                    <BaseFretboard />
                </FretboardSvg>

                <HardLink prompt={prompt} onClick={setTestSpec} />
            </div >
        </>
    );
};

function getConfigFromLocalStorage(): FretboardTestSettings {
    const text = localStorage.getItem("fretboardTestSettings");

    if (!text) {
        return defaultFretboardTestSettings;
    }

    return JSON.parse(text) as FretboardTestSettings;
}

function storeFretboardTestSettingsInLocalStorage(settings: FretboardTestSettings) {
    localStorage.setItem("fretboardTestSettings", JSON.stringify(settings));
}

const ClickedFretsGroup = styled.g``;
