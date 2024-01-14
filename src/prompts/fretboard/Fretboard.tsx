import { useCallback, useState } from "react";
import styled from "styled-components";
import { Note, Scale } from "tonal";
import { calculateFretPosition } from "./calculateFretPosition";
import { activeRectangleBottom, activeRectangleTop, displayedFretCount, fullScaleLength, paddingLeft, stringDistance, strings } from "./constants";
import { getY } from "./helpers";

type OnStringAndFretClick = (note: string, stringNumber: number, fretNumber: number) => void;

type ClickedFret = {
    stringNumber: number;
    fretNumber: number;
    result: "good" | "bad";
};

type ClickedFretWithId = ClickedFret & { id: string };

export function WithClickedFretList(): [ClickedFretWithId[], (clickedFret: ClickedFret) => void, () => void] {
    const [clickedFrets, setClickedFrets] = useState<ClickedFretWithId[]>([]);

    const addClickedFret = (clickedFret: ClickedFret) => {
        const randomId = crypto.randomUUID();

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

export const ClickableSection = ({ startFret, endFret, onFretClick }: { startFret: number; endFret: number; onFretClick: OnStringAndFretClick }) => {
    const drawActiveRectangle = 0 < startFret || endFret < displayedFretCount;

    const activeRectangleLeft = calculateFretPosition(startFret - 1, fullScaleLength) + paddingLeft;
    const activeRectangleRight = calculateFretPosition(endFret, fullScaleLength) + paddingLeft;

    return <g className="clickable-section">
        {drawActiveRectangle ? <ActiveRectangle x={activeRectangleLeft} y={activeRectangleTop} width={activeRectangleRight - activeRectangleLeft} height={activeRectangleBottom - activeRectangleTop} /> : null}

        {strings.map((note, index) => (
            <ClickableGuitarStringOverlay stringNumber={index} note={note} key={note} firstClickableFret={startFret} lastClickableFret={endFret} onClick={onFretClick} />
        ))}
    </g>
}

type ClickableGuitarStringOverlayProps = {
    stringNumber: number;
    note: string;
    onClick: OnStringAndFretClick;
    firstClickableFret: number;
    lastClickableFret: number;
};

const ClickableGuitarStringOverlay = ({ note, stringNumber, onClick, firstClickableFret, lastClickableFret }: ClickableGuitarStringOverlayProps) => {
    const getAllNotes = (note: string) => Scale.get(`${note} chromatic`).notes;

    const octaveHigher = Note.transposeOctaves(note, 1);

    const notesOnString = [...getAllNotes(note), ...getAllNotes(octaveHigher)].slice(0, displayedFretCount + 1);

    notesOnString.shift();

    return <>
        {firstClickableFret === 0 ? <ClickableRectangle stringNumber={stringNumber} fretNumber={0} note={note} onClick={onClick} /> : null}

        {notesOnString.map((note, position) => {
            const fretNumber = position + 1;

            if (firstClickableFret <= fretNumber && fretNumber <= lastClickableFret) {
                return <ClickableRectangle key={note} stringNumber={stringNumber} fretNumber={fretNumber} note={note} onClick={onClick} />
            }
        })};
    </>;
};

type ClickableRectangleProps = {
    note: string;
    stringNumber: number;
    fretNumber: number;
    onClick: OnStringAndFretClick;
};

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

const ClickableRectangle = ({ note, stringNumber, fretNumber, onClick }: ClickableRectangleProps) => {
    const onRectClicked = useCallback(() => {
        onClick(note, stringNumber, fretNumber);
    }, [note, stringNumber, fretNumber, onClick]);

    const left = calculateFretPosition(fretNumber - 1, fullScaleLength) + paddingLeft;
    const right = calculateFretPosition(fretNumber, fullScaleLength) + paddingLeft;

    const y = getY(stringNumber);

    return <ClickableRectangleSvg
        onClick={onRectClicked}
        x={left}
        y={y - stringDistance / 2}
        width={right - left}
        height={stringDistance}
    />
}

const ClickedRectangleSvg = styled.rect<{ $result: "good" | "bad" | undefined }>`
    stroke: ${props => props.$result === "good" ? "#55ff55" : props.$result === "bad" ? "#ff0000" : "transparent"};
    stroke-width: 1;

    fill: transparent;
    pointer-events: none;
`;

const ClickableRectangleSvg = styled.rect`
    fill: transparent;
`;

const ActiveRectangle = styled.rect`
    stroke: 1px solid #88ff88;
    fill: #ccffcc;
`;
