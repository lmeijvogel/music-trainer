import { useCallback, useState } from "react";
import styled from "styled-components";
import { Note, Scale } from "tonal";
import { calculateFretPosition } from "./calculateFretPosition";

const stringDistance = 7;
const fullScaleLength = 400;

const displayedFretCount = 12;

const paddingTop = 4;
const paddingLeft = 20;
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

    const maxStringX = paddingLeft + lastFretX;

    const fretHeight = (strings.length - 1) * stringDistance + paddingTop;

    return <FretboardSvg viewBox={`0 0 ${maxStringX + 10} 60`}>
        {strings.map((note, index) => (
            <GuitarString note={note} key={note} x1={paddingLeft} x2={maxStringX} y={index * stringDistance + paddingTop} onClick={onClick} />
        ))}
        {range(0, 12).map(fretNumber => {
            const x = calculateFretPosition(fretNumber, fullScaleLength);

            return <Fret key={fretNumber} x1={paddingLeft + x} x2={paddingLeft + x} y1={paddingTop} y2={fretHeight} />
        })}
        {range(1, displayedFretCount - 12).map(fretNumber => {
            // Above the octave
            const x = calculateFretPosition(fretNumber, fullScaleLength / 2);

            return <Fret key={fretNumber} x1={200 + paddingLeft + x} x2={200 + paddingLeft + x} y1={paddingTop} y2={fretHeight} />
        })}

        {[3, 5, 7, 9, 15, 17, 19, 22].filter(n => n <= displayedFretCount).map(fretNumber => {
            const fretPosition = calculateFretCenter(fretNumber);

            return <Dot key={fretNumber} cx={paddingLeft + fretPosition} cy={fretHeight + 3} r={1} />;
        })}

        <OctaveMarker cx={paddingLeft + calculateFretCenter(12)} cy={fretHeight + 3} r={1} />;
    </FretboardSvg>;
}

const FretboardSvg = styled.svg`
    width: 100vw;
`;

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
    return <ClickableFret note={note} left={-paddingLeft} right={0} y={y} onClick={onClick} />
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
        x={left + paddingLeft}
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
