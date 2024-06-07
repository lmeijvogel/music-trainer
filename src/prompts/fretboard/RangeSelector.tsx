import styled from "styled-components";

import { ChangeEventHandler } from "react";

type Props<T> = {
    currentRange: { min: T; max: T };
    allowedValues: T[];
    onMinChange: (position: T) => void;
    onMaxChange: (position: T) => void;
    valueToString: (value: T) => string
};

export function RangeSelector<T>({ currentRange, allowedValues, onMinChange, onMaxChange, valueToString }: Props<T>) {
    const onMinInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        const value = allowedValues[position];
        onMinChange(value);

        const maxPosition = allowedValues.indexOf(currentRange.max);

        if (maxPosition < position) {
            onMaxChange(value);
        }
    };

    const onMaxInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        const value = allowedValues[position];
        onMaxChange(value);

        const minPosition = allowedValues.indexOf(currentRange.min);

        if (position < minPosition) {
            onMinChange(value);
        }
    };

    const minPosition = allowedValues.indexOf(currentRange.min);
    const maxPosition = allowedValues.indexOf(currentRange.max);

    return (
        <>
            <PositionInput>
                <PositionLabel>Van:</PositionLabel>
                <input
                    type="range"
                    min={0}
                    max={allowedValues.length - 1}
                    value={minPosition}
                    onChange={onMinInputChange}
                    list="markers"
                />
                <PositionValueLabel>{valueToString(currentRange.min)}</PositionValueLabel>
                <datalist id="markers">
                    {allowedValues.map((val, i) => (
                        <option key={valueToString(val)} id={`${val}`} value={i}></option>
                    ))}
                </datalist>
            </PositionInput>
            <PositionInput>
                <PositionLabel>Tot:</PositionLabel>
                <input
                    type="range"
                    min={0}
                    max={allowedValues.length - 1}
                    value={maxPosition}
                    onChange={onMaxInputChange}
                    list="markers"
                />
                <PositionValueLabel>{valueToString(currentRange.max)}</PositionValueLabel>
                <datalist id="markers">
                    {allowedValues.map((val, i) => (
                        <option key={valueToString(val)} id={`${val}`} value={i}></option>
                    ))}
                </datalist>
            </PositionInput>
        </>
    );
}

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
