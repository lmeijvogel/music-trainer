import { ChangeEventHandler, useState } from "react";
import { Dialog } from "./Dialog";
import { FretboardTestSettings } from "./FretboardTestSettings";
import styled from "styled-components";
import { StringsSelector } from "./StringsSelector";

type Props = {
    initialSettings: FretboardTestSettings;
    allowedPositions: number[];
    onSubmit: (newSettings: FretboardTestSettings) => void;
};

const allKeySignatures = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"];

export const FretboardTestPreferencesDialog = ({ initialSettings, allowedPositions, onSubmit }: Props) => {
    const [strings, setStrings] = useState<string[]>(initialSettings.strings);
    const [minPosition, setMinPosition] = useState<number>(initialSettings.minPosition);
    const [maxPosition, setMaxPosition] = useState<number>(initialSettings.maxPosition);
    const [keySignature, setKeySignature] = useState<string>(initialSettings.keySignature);

    const onKeySignatureChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const newSignature = event.target.value;

        setKeySignature(newSignature);
    };

    const onMinPositionChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        setMinPosition(position);

        if (maxPosition < position) {
            setMaxPosition(position);
        }
    };

    const onMaxPositionChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        setMaxPosition(position);

        if (position < minPosition) {
            setMinPosition(position);
        }
    };

    const onSubmitButtonClick = () => {
        const newSettings: FretboardTestSettings = {
            keySignature,
            strings,
            minPosition,
            maxPosition
        };

        onSubmit(newSettings);
    };
    return (
        <Dialog>
            <DialogContents>
                <div>
                    <StyledSection>
                        <Title>Snaren</Title>
                        <StringsSelector strings={strings} onChange={setStrings} />
                    </StyledSection>
                    <StyledSection>
                        <Title>Toonsoort</Title>
                        <KeySelect defaultValue={keySignature} onChange={onKeySignatureChange}>
                            {allKeySignatures.map((sig) => (
                                <KeySignatureOption key={sig} value={sig} />
                            ))}
                        </KeySelect>
                    </StyledSection>
                    <StyledSection>
                        <Title>Posities</Title>
                        <PositionInput>
                            <PositionLabel>Van:</PositionLabel>
                            <input
                                type="range"
                                min={allowedPositions.at(0)}
                                max={allowedPositions.at(-1)}
                                step={2}
                                value={minPosition}
                                onChange={onMinPositionChange}
                                list="markers"
                            />
                            <PositionValueLabel>{minPosition}</PositionValueLabel>
                            <datalist id="markers">
                                {allowedPositions.map((val) => (
                                    <option key={val} id={`${val}`} value={val}></option>
                                ))}
                            </datalist>
                        </PositionInput>
                        <PositionInput>
                            <PositionLabel>Tot:</PositionLabel>
                            <input
                                type="range"
                                min={allowedPositions.at(0)}
                                max={allowedPositions.at(-1)}
                                step={2}
                                value={maxPosition}
                                onChange={onMaxPositionChange}
                                list="markers"
                            />
                            <PositionValueLabel>{maxPosition}</PositionValueLabel>
                            <datalist id="markers">
                                {allowedPositions.map((val) => (
                                    <option key={val} id={`${val}`} value={val}></option>
                                ))}
                            </datalist>
                        </PositionInput>
                    </StyledSection>
                </div>
                <BottomBar>
                    <button onClick={onSubmitButtonClick}>Pas toe</button>
                </BottomBar>
            </DialogContents>
        </Dialog>
    );
};

const DialogContents = styled.div`
    display: flex;
    flex-direction: column;

    padding: 10px;
`;

type KeySignatureOptionProps = {
    value: string;
};

const KeySignatureOption = ({ value }: KeySignatureOptionProps) => {
    return <option value={value}>{value}</option>;
};
const StyledSection = styled.section`
    display: flex;
    flex-direction: column;

    align-items: center;
    min-width: 300px;
`;

const Title = styled.h3`
    width: 100%;
    text-align: center;
`;

const KeySelect = styled.select`
    width: 50px;
`;

const PositionInput = styled.label`
    display: flex;
    flex-direction: row;
    justify-content: center;

    align-items: center;
`;

const PositionLabel = styled.span`
    width: 30px;

    margin-right: 5px;
    text-align: right;
`;

const PositionValueLabel = styled.span`
    width: 30px;

    text-align: right;
`;

const BottomBar = styled.div`
    min-height: 30px;

    padding: 10px;

    display: flex;
    flex-direction: row;

    justify-content: flex-end;
`;
