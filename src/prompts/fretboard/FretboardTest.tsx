import { useCallback, useEffect, useMemo, useState } from "react";
import { FretboardPromptGenerator } from "./FretboardPromptGenerator";
import { SingleNoteStave } from "../SingleNoteStave";
import { ClickedFretMarker, FretboardSvg, WithClickedFretList } from "./Fretboard";
import { TestSpec, parseLocationBar } from "../../helpers/locationBarHelpers";
import { FretboardPrompt } from "./FretboardPrompt";
import { HardLink } from "../../HardLink";
import { ErrorDisplay } from "../../ErrorDisplay";
import {
    allKeySignatures,
    allStrings,
    displayedFretCount,
    fretMarkerDistance,
    fretMarkerRadius,
    fullScaleLength,
    paddingLeft,
    strings
} from "./constants";

import { calculateFretPosition } from "./calculateFretPosition";
import styled from "styled-components";

import { BaseFretboard } from "./BaseFretboard";
import { findNextPrompt } from "../../helpers/promptGeneratorHelpers";
import { FretboardTestSettings } from "./FretboardTestSettings";
import { ClickableFretboardSection } from "./ClickableFretboardSection";
import { FretboardTestPreferencesDialog } from "./FretboardTestPreferencesDialog";
import { useEmphasizedNotes } from "./useEmphasizedNotes";
import { TestPreferencesDisplay } from "./TestPreferencesDisplay";
import { useStringDistance } from "../../hooks/useStringDistance";
import { Direction } from "tonal";
import { Timer } from "./Timer";

const defaultFretboardTestSettings: FretboardTestSettings = {
    minString: "E5",
    maxString: "E5",
    minPosition: 0,
    maxPosition: 0,
    keySignature: "C"
};

export const FretboardTest = () => {
    const [prefsDialogVisible, setPrefsDialogVisible] = useState(false);
    const [config, setConfig] = useState<FretboardTestSettings>(getConfigFromLocalStorage());

    const [lastOkTime, setLastOkTime] = useState(performance.now());
    const [testSpec, setTestSpec] = useState<TestSpec | undefined>(parseLocationBar(window.location));

    const [emphasizedNotes, markCorrect, markIncorrect] = useEmphasizedNotes();

    const promptGenerator = useMemo(() => new FretboardPromptGenerator(config), [config]);

    const stringDistance = useStringDistance();

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

                markIncorrect(prompt.note);
                setErrorMessage(check);
            } else {
                addClickedFret({
                    stringNumber,
                    fretNumber,
                    result: "good"
                });

                markCorrect(prompt.note);

                setLastOkTime(performance.now());

                if (!testSpec) setPrompt(findNextPrompt(promptGenerator.makeRandomPrompt, prompt));

                setErrorMessage(undefined);
            }
        },
        [prompt, addClickedFret, markIncorrect, markCorrect, testSpec, promptGenerator.makeRandomPrompt]
    );

    useEffect(() => {
        promptGenerator.setEmphasizedNotes(emphasizedNotes);
    }, [promptGenerator, emphasizedNotes]);

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

    const onKeyChange = useCallback((direction: Direction) => {
        const currentSignatureIndex = allKeySignatures.indexOf(config.keySignature);

        let nextSignatureIndex = currentSignatureIndex + direction;
        if (nextSignatureIndex < 0) nextSignatureIndex = 0;
        if (nextSignatureIndex >= allKeySignatures.length) nextSignatureIndex = allKeySignatures.length - 1;

        if (nextSignatureIndex !== currentSignatureIndex) {
            const newSettings = { ...config, keySignature: allKeySignatures[nextSignatureIndex] };

            applyConfig(newSettings);
        }
    }, [config]);

    return (
        <>
            {prefsDialogVisible ? (
                <FretboardTestPreferencesDialog
                    initialSettings={config}
                    allowedPositions={[0, 2, 4, 6, 8]}
                    onSubmit={applyConfig}
                />
            ) : null}
            <div>
                <ErrorDisplay text={errorMessage} />
                <TopRow>
                    <TopRowColumn>
                        <TestPreferencesDisplay config={config} onShowPreferencesDialog={showPrefsDialog} />
                    </TopRowColumn>
                    <TopRowColumn>
                        <SingleNoteStave prompt={prompt} onKeyChange={onKeyChange} />
                    </TopRowColumn>
                    <TopRowColumn>
                        <Timer lastOkTime={lastOkTime} />
                    </TopRowColumn>
                </TopRow>

                <FretboardSvg viewBox={viewBox}>
                    <ClickableFretboardSection
                        startFret={prompt.startFret ?? 0}
                        endFret={prompt.endFret ?? displayedFretCount}
                        minString={config.minString}
                        maxString={config.maxString}
                        onFretClick={onSubmitInput}
                    />

                    <g>
                        {clickedFrets.map((clickedFret) => (
                            <ClickedFretMarker
                                key={clickedFret.id}
                                clickedSquare={clickedFret}
                                afterFadeout={clearClickedFrets}
                            />
                        ))}
                    </g>
                    <BaseFretboard />
                </FretboardSvg>

                <HardLink prompt={prompt} onClick={setTestSpec} />
            </div>
        </>
    );
};

const TopRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const TopRowColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 33%;
`;

function getConfigFromLocalStorage(): FretboardTestSettings {
    const text = localStorage.getItem("fretboardTestSettings");

    if (!text) {
        return defaultFretboardTestSettings;
    }

    const storedConfig = JSON.parse(text) as FretboardTestSettings;

    storedConfig.minString ||= allStrings.at(0)!;
    storedConfig.maxString ||= allStrings.at(0)!;

    return storedConfig;
}

function storeFretboardTestSettingsInLocalStorage(settings: FretboardTestSettings) {
    localStorage.setItem("fretboardTestSettings", JSON.stringify(settings));
}
