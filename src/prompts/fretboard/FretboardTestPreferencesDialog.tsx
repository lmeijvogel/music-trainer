import { ChangeEventHandler, useState } from "react";
import { Dialog } from "./Dialog";
import { FretboardTestSettings } from "./FretboardTestSettings";
import styled from "styled-components";

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

    const allStrings = ["E5", "B4", "G4", "D4", "A3", "E3"];

    const lowestString = strings.length;

    const selectCumulative = (
        allEntries: string[],
        selectedEntries: string[],
        index: number,
        checked: boolean
    ): string[] => {
        const highestSelectedIndex = selectedEntries.length;

        // When clicking the lowest selected item, then just toggle that one on/off,
        // If any other item is clicked, that item will be the new lowest one.
        const highestSelectedIndexClicked = !checked && index === highestSelectedIndex - 1;
        const newHighestSelectedIndex = highestSelectedIndexClicked ? index - 1 : index;

        return allEntries.slice(0, newHighestSelectedIndex + 1);
    };
    const onStringChange = (i: number, checked: boolean) => {
        setStrings(selectCumulative(allStrings, strings, i, checked));
    };

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
                        <ul>
                            {allStrings.map((str, i) => (
                                <ListItem key={str}>
                                    <Checkbox i={i} checked={i < lowestString} onChange={onStringChange}>
                                        {str[0]}
                                    </Checkbox>
                                </ListItem>
                            ))}
                        </ul>
                    </StyledSection>
                    <StyledSection>
                        <Title>Toonsoort</Title>
                        <select defaultValue={keySignature} onChange={onKeySignatureChange}>
                            {allKeySignatures.map((sig) => (
                                <KeySignatureOption key={sig} value={sig} />
                            ))}
                        </select>
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
    min-width: 300px;
`;

const Title = styled.h3`
    width: 100%;
    text-align: center;
`;

const ListItem = styled.li`
    list-style-type: none;
`;

const Checkbox = <T,>({
    i,
    checked,
    children,
    onChange
}: {
    i: T;
    checked: boolean;
    children: JSX.Element | string;
    onChange: (i: T, newValue: boolean) => void;
}) => {
    const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(i, event.target.checked);
    };

    return (
        <label>
            <StyledInput type="checkbox" checked={checked} onChange={onCheckboxChange} />
            {children}
        </label>
    );
};

const PositionInput = styled.label`
    display: flex;
    flex-direction: row;
    justify-content: center;

    align-items: center;
`;

const StyledInput = styled.input`
    margin-right: 12px;
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
