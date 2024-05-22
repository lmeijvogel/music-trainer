import { useState } from "react";
import styled from "styled-components";
import { calculateFretPosition } from "./calculateFretPosition";
import { fullScaleLength, paddingLeft, stringDistance } from "./constants";
import { getY } from "./helpers";

type ClickedFret = {
    stringNumber: number;
    fretNumber: number;
    result: "good" | "bad";
};

type ClickedFretWithId = ClickedFret & { id: string };

export function WithClickedFretList(): [ClickedFretWithId[], (clickedFret: ClickedFret) => void, () => void] {
    const [clickedFrets, setClickedFrets] = useState<ClickedFretWithId[]>([]);

    const addClickedFret = (clickedFret: ClickedFret) => {
        const randomId = crypto.randomUUID ? crypto.randomUUID() : Math.floor(Math.random() * 1000000000000).toString();

        const entryWithId = { ...clickedFret, id: randomId };

        setClickedFrets([...clickedFrets, entryWithId]);

        if (clickedFret.result === "good") setTimeout(clearClickedFrets, 500);
    };

    const clearClickedFrets = () => {
        setClickedFrets([]);
    }
    return [clickedFrets, addClickedFret, clearClickedFrets];
}

export const FretboardSvg = styled.svg`
    width: 100vw;
`;

const ClickedRectangleSvg = styled.rect<{ $result: "good" | "bad" | undefined }>`
    stroke: ${props => props.$result === "good" ? "#55ff55" : props.$result === "bad" ? "#ff0000" : "transparent"};
    stroke-width: 1;

    fill: transparent;
    pointer-events: none;
`;

type ClickedRectangleProps = {
    clickedSquare: ClickedFretWithId;
    afterFadeout: () => void;
};

export const ClickedFretMarker = ({ clickedSquare, afterFadeout }: ClickedRectangleProps) => {
    const left = calculateFretPosition(clickedSquare.fretNumber - 1, fullScaleLength) + paddingLeft;
    const right = calculateFretPosition(clickedSquare.fretNumber, fullScaleLength) + paddingLeft;

    const y = getY(clickedSquare.stringNumber);

    return <ClickedRectangleSvg
        x={left}
        y={y - stringDistance / 2}
        width={right - left}
        height={stringDistance}
        $result={clickedSquare.result}
        onTransitionEnd={afterFadeout}
    />
};

