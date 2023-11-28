import { useCallback, useState } from "react";
import styled from "styled-components";
import { Note, Scale } from "tonal";
import { calculateFretPosition } from "./calculateFretPosition";

const stringDistance = 7;
const fullScaleLength = 400;

const displayedFretCount = 15;

type OnNoteClick = (note: string) => "good" | "bad" | undefined;

function calculateFretCenter(fretNumber: number): number {
    const left = calculateFretPosition(fretNumber - 1, fullScaleLength);
    const right = calculateFretPosition(fretNumber, fullScaleLength);

    return (left + right) / 2;
}

export const Fretboard = ({ onNoteClick }: { onNoteClick: OnNoteClick }) => {
    const strings = ["E5", "B4", "G4", "D4", "A3", "E3"];

    const lastFretX = calculateFretPosition(displayedFretCount, fullScaleLength);

    const onClick = useCallback((note: string) => onNoteClick(note), [onNoteClick]);

    return <svg viewBox="0 0 300 100">
        {strings.map((note, index) => (
            <GuitarString note={note} key={note} x1={10} x2={10 + lastFretX} y={index * stringDistance + 10} onClick={onClick} />
        ))}
        {range(0, 12).map(fretNumber => {
            const x = calculateFretPosition(fretNumber, fullScaleLength);

            return <Fret key={fretNumber} x1={10 + x} x2={10 + x} y1={10} y2={45} />
        })}
        {range(1, displayedFretCount - 12).map(fretNumber => {
            // Above the octave
            const x = calculateFretPosition(fretNumber, fullScaleLength / 2);

            return <Fret key={fretNumber} x1={210 + x} x2={210 + x} y1={10} y2={45} />
        })}

        {[3, 5, 7, 10, 15, 17, 19, 22].filter(n => n <= displayedFretCount).map(fretNumber => {
            const fretPosition = calculateFretCenter(fretNumber);

            return <Dot key={fretNumber} cx={10 + fretPosition} cy={7 * stringDistance} r={1} />;
        })}

        <OctaveMarker cx={10 + calculateFretCenter(12)} cy={7 * stringDistance} r={1} />;
    </svg>;
}

const GuitarString = ({ note, x1, x2, y, onClick }: { note: string, x1: number, x2: number, y: number, onClick: OnNoteClick }) => {
    const getAllNotes = (note: string) => Scale.get(`${note} chromatic`).notes;

    const octaveHigher = Note.transposeOctaves(note, 1);

    const notesOnString = [...getAllNotes(note), ...getAllNotes(octaveHigher)].slice(0, displayedFretCount + 1);

    notesOnString.shift();

    return <>
        <StringLine x1={x1} x2={x2} y1={y} y2={y} />
        <ClickableOpenString y={y} note={note} onClick={onClick} />

        {notesOnString.map((note, position) => {
            const xLeft = calculateFretPosition(position, fullScaleLength);
            const xRight = calculateFretPosition(position + 1, fullScaleLength);

            return <ClickableFret key={note} left={xLeft} right={xRight} y={y} note={note} onClick={onClick} />

        })};
    </>;
};

const ClickableOpenString = ({ note, y, onClick }: { note: string, y: number, onClick: OnNoteClick }) => {
    return <ClickableFret note={note} left={-10} right={0} y={y} onClick={onClick} />
};

const ClickableFret = ({ note, y, left, right, onClick }: { note: string, y: number, left: number, right: number, onClick: OnNoteClick }) => {
    const [clicked, setClicked] = useState<"good" | "bad" | undefined>(undefined);

    const onRectClicked = () => {
        setClicked(onClick(note));

        setTimeout(() => {
            setClicked(undefined);
        }, 0);
    };

    return <ClickableFretSvg
        onClick={onRectClicked}
        x={left + 10}
        y={y - stringDistance / 2}
        width={right - left}
        height={stringDistance}
        clicked={clicked}
    />;

};

const ClickableFretSvg = styled.rect<{ clicked: "good" | "bad" | undefined }>`
    stroke: ${props => props.clicked === "good" ? "#55ff55" : props.clicked === "bad" ? "#ff0000" : "transparent"};
    ${props => props.clicked ? "" : "transition: stroke 1s,stroke-width 1s"};
    stroke-width: ${props => props.clicked ? 1 : 0.1};

    fill: transparent;
`;

const OctaveMarker = ({ cx, cy, r }: { cx: number, cy: number, r: number }) => {
    return <>
        <Dot cx={cx - 1.1} cy={cy} r={r} />
        <Dot cx={cx + 1.1} cy={cy} r={r} />
    </>;
}

const StringLine = styled.line`
    stroke: black;
    stroke-width: 0.5px;
`;

const Fret = styled.line`
    stroke: #666666;
    stroke-width: 1px;
`;

const Dot = styled.circle`
    fill: #666666;
`;

function range(first: number, last: number): number[] {
    return new Array(last - first + 1).fill(0).map((_val, i) => first + i);
}
