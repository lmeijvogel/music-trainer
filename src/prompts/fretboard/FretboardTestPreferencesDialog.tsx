import { ChangeEventHandler, useState } from "react";
import { Dialog } from "./Dialog";
import { FretboardTestSettings } from "./FretboardTestSettings";
import styled from "styled-components";
import { RangeSelector } from "./RangeSelector";
import { allKeySignatures } from "./constants";

// TODO: Remove StringSelector

type Props = {
    initialSettings: FretboardTestSettings;
    allowedPositions: number[];
    onSubmit: (newSettings: FretboardTestSettings) => void;
};

export const FretboardTestPreferencesDialog = ({ initialSettings, allowedPositions, onSubmit }: Props) => {
    const [minString, setMinString] = useState<string>(initialSettings.minString);
    const [maxString, setMaxString] = useState<string>(initialSettings.maxString);
    const [minPosition, setMinPosition] = useState<number>(initialSettings.minPosition);
    const [maxPosition, setMaxPosition] = useState<number>(initialSettings.maxPosition);
    const [keySignature, setKeySignature] = useState<string>(initialSettings.keySignature);

    const onKeySignatureChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const newSignature = event.target.value;

        setKeySignature(newSignature);
    };

    const onSubmitButtonClick = () => {
        const newSettings: FretboardTestSettings = {
            keySignature,
            minString,
            maxString,
            minPosition,
            maxPosition
        };

        onSubmit(newSettings);
    };

    const allStrings = ["E5", "B4", "G4", "D4", "A3", "E3"];

    return (
        <Dialog>
            <DialogContents>
                <Sections>
                    <StyledSection>
                        <Title>Snaren</Title>
                        <RangeSelector
                            currentRange={{ min: minString, max: maxString }}
                            allowedValues={allStrings}
                            onMinChange={setMinString}
                            onMaxChange={setMaxString}
                            valueToString={(el) => el}
                        />
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
                        <RangeSelector
                            currentRange={{ min: minPosition, max: maxPosition }}
                            allowedValues={allowedPositions}
                            onMinChange={setMinPosition}
                            onMaxChange={setMaxPosition}
                            valueToString={(value) => `${value}`}
                        />
                    </StyledSection>
                </Sections>
                <BottomBar>
                    <button onClick={onSubmitButtonClick}>Pas toe</button>
                </BottomBar>
            </DialogContents>
        </Dialog>
    );
};

const Sections = styled.div`
    display:flex;
    flex-direction: column;

    @media (max-height: 400px) {
        flex - direction: row;
    }
`;

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

    // The dialog would normally be very narrow, so make it a bit bigger
    // On mobile, it looks a bit nicer with narrower sections, because
    // otherwise there's a lot of empty space.
    min-width: 400px;

    @media (max-height: 400px) {
        min-width: 200px;
    }
`;

const Title = styled.h3`
    width: 100%;
    text-align: center;
`;

const KeySelect = styled.select`
    width: 50px;
`;

const BottomBar = styled.div`
    min-height: 30px;

    padding: 10px;

    display: flex;
    flex-direction: row;

    justify-content: flex-end;
`;
