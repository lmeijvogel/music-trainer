import styled from "styled-components";

import { ChangeEventHandler } from "react";

type Props = {
    positions: { min: number; max: number };
    allowedPositions: number[];
    onMinChange: (position: number) => void;
    onMaxChange: (position: number) => void;
};
export const PositionsSelector = ({ positions, allowedPositions, onMinChange, onMaxChange }: Props) => {
    const onMinInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        onMinChange(position);

        if (positions.max < position) {
            onMaxChange(position);
        }
    };

    const onMaxInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const position = parseInt(event.target.value, 10);

        onMaxChange(position);

        if (position < positions.min) {
            onMinChange(position);
        }
    };

    return (
        <>
            <PositionInput>
                <PositionLabel>Van:</PositionLabel>
                <input
                    type="range"
                    min={allowedPositions.at(0)}
                    max={allowedPositions.at(-1)}
                    step={2}
                    value={positions.min}
                    onChange={onMinInputChange}
                    list="markers"
                />
                <PositionValueLabel>{positions.min}</PositionValueLabel>
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
                    value={positions.max}
                    onChange={onMaxInputChange}
                    list="markers"
                />
                <PositionValueLabel>{positions.max}</PositionValueLabel>
                <datalist id="markers">
                    {allowedPositions.map((val) => (
                        <option key={val} id={`${val}`} value={val}></option>
                    ))}
                </datalist>
            </PositionInput>
        </>
    );
};

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
