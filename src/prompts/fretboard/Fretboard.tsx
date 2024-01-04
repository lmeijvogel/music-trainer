import { useCallback, useState } from "react";
import styled from "styled-components";
import { Note, Scale } from "tonal";
import { calculateFretPosition } from "./calculateFretPosition";

const stringDistance = 10;
const fullScaleLength = 800;
const octavePosition = fullScaleLength / 2;

const displayedFretCount = 12;

const paddingTop = 10;
const paddingLeft = 40;

const fretMarkerDistance = 6;
const fretMarkerRadius = 1.2;

type OnNoteClick = (note: string) => "good" | "bad" | undefined;

function calculateFretCenter(fretNumber: number): number {
    const left = calculateFretPosition(fretNumber - 1, fullScaleLength);
    const right = calculateFretPosition(fretNumber, fullScaleLength);

    return (left + right) / 2;
}

type Props = {
    startFret?: number;
    endFret?: number;
    onNoteClick: OnNoteClick
};

export const Fretboard = ({ onNoteClick, startFret = 0, endFret = displayedFretCount }: Props) => {
    const strings = ["E5", "B4", "G4", "D4", "A3", "E3"];

    const lastFretX = calculateFretPosition(displayedFretCount, fullScaleLength);

    const onClick = useCallback((note: string) => onNoteClick(note), [onNoteClick]);

    const maxStringX = paddingLeft + lastFretX;

    const fretPadding = 1;
    const fretTop = paddingTop - fretPadding;

    const fretBottom = (strings.length - 1) * stringDistance + paddingTop + fretPadding;

    const activeRectangleTop = paddingTop - stringDistance / 2;
    const activeRectangleBottom = paddingTop + (strings.length - 0.5) * stringDistance;

    const activeRectangleLeft = calculateFretPosition(startFret - 1, fullScaleLength) + paddingLeft;
    const activeRectangleRight = calculateFretPosition(endFret, fullScaleLength) + paddingLeft;

    const drawActiveRectangle = 0 < startFret || endFret < displayedFretCount;

    return <FretboardSvg viewBox={`0 0 ${maxStringX + 10} ${stringDistance * strings.length + fretMarkerDistance + fretMarkerRadius * 2 + 10}`}>
        {drawActiveRectangle ? <ActiveRectangle x={activeRectangleLeft} y={activeRectangleTop} width={activeRectangleRight - activeRectangleLeft} height={activeRectangleBottom - activeRectangleTop} /> : null}

        {strings.map((note, index) => (
            <GuitarString note={note} key={note} firstClickableFret={startFret} lastClickableFret={endFret} y={index * stringDistance + paddingTop} onClick={onClick} />
        ))}
        {range(0, 12).map(fretNumber => {
            const x = calculateFretPosition(fretNumber, fullScaleLength);

            return <Fret key={fretNumber} x1={paddingLeft + x} x2={paddingLeft + x} y1={fretTop} y2={fretBottom} $clickable={startFret <= fretNumber && fretNumber <= endFret} />
        })}
        {range(1, displayedFretCount - 12).map(fretNumber => {
            // Above the octave
            const x = calculateFretPosition(fretNumber, fullScaleLength / 2);

            return <Fret key={fretNumber} x1={octavePosition + paddingLeft + x} x2={octavePosition + paddingLeft + x} y1={fretTop} y2={fretBottom} $clickable={startFret <= fretNumber && fretNumber <= endFret} />
        })}

        {[3, 5, 7, 9, 15, 17, 19, 22].filter(n => n <= displayedFretCount).map(fretNumber => {
            const fretPosition = calculateFretCenter(fretNumber);

            return <Dot key={fretNumber} cx={paddingLeft + fretPosition} cy={fretBottom + fretMarkerDistance} r={fretMarkerRadius} />;
        })}

        <OctaveMarker cx={paddingLeft + calculateFretCenter(12)} cy={fretBottom + fretMarkerDistance} r={fretMarkerRadius} />;
    </FretboardSvg>;
}

const FretboardSvg = styled.svg`
    width: 100vw;
`;

type GuitarStringProps = {
    note: string;
    y: number;
    onClick: OnNoteClick;
    firstClickableFret?: number;
    lastClickableFret?: number;
};

const GuitarString = ({ note, y, onClick, firstClickableFret = 0, lastClickableFret = displayedFretCount }: GuitarStringProps) => {
    const getAllNotes = (note: string) => Scale.get(`${note} chromatic`).notes;

    const octaveHigher = Note.transposeOctaves(note, 1);

    const notesOnString = [...getAllNotes(note), ...getAllNotes(octaveHigher)].slice(0, displayedFretCount + 1);

    notesOnString.shift();

    return <>
        {firstClickableFret === 0 ? <ClickableOpenString y={y} note={note} onClick={onClick} /> : null}

        {notesOnString.map((note, position) => {
            const fret = position + 1;
            const xLeft = calculateFretPosition(fret - 1, fullScaleLength) + paddingLeft;
            const xRight = calculateFretPosition(fret, fullScaleLength) + paddingLeft;

            if (firstClickableFret <= fret && fret <= lastClickableFret) {
                return <ClickableStringSegment key={note} left={xLeft} right={xRight} y={y} note={note} onClick={onClick} />
            } else {
                return <StringLine key={note} x1={xLeft} x2={xRight} y1={y} y2={y} $clickable={false} />
            }
        })};
    </>;
};

const ClickableOpenString = ({ note, y, onClick }: { note: string, y: number, onClick: OnNoteClick }) => {
    return <ClickableStringSegment note={note} left={4} right={paddingLeft} y={y} onClick={onClick} renderString={false} />
};

type ClickableStringSegmentProps = {
    note: string;
    y: number;
    left: number;
    right: number;
    onClick: OnNoteClick;
    renderString?: boolean;
};


const ClickableStringSegment = ({ note, y, left, right, onClick, renderString = true }: ClickableStringSegmentProps) => {
    const [clicked, setClicked] = useState<"good" | "bad" | undefined>(undefined);

    const onRectClicked = () => {
        setClicked(onClick(note));

        setTimeout(() => {
            setClicked(undefined);
        }, 0);
    };

    return <>
        {renderString ? <StringLine x1={left} x2={right} y1={y} y2={y} $clickable={true} /> : null}
        <ClickableFretSvg
            onClick={onRectClicked}
            x={left}
            y={y - stringDistance / 2}
            width={right - left}
            height={stringDistance}
            clicked={clicked}
        />
    </>;

};

const ClickableFretSvg = styled.rect<{ clicked: "good" | "bad" | undefined }>`
    stroke: ${props => props.clicked === "good" ? "#55ff55" : props.clicked === "bad" ? "#ff0000" : "transparent"};
    ${props => props.clicked ? "" : "transition: stroke 1s,stroke-width 1s"};
    stroke-width: ${props => props.clicked ? 1 : 0.1};

    fill: transparent;
`;

const OctaveMarker = ({ cx, cy, r }: { cx: number, cy: number, r: number }) => {
    return <>
        <Dot cx={cx - (r * 1.1)} cy={cy} r={r} />
        <Dot cx={cx + (r * 1.1)} cy={cy} r={r} />
    </>;
}

const ActiveRectangle = styled.rect`
    stroke: 1px solid #88ff88;
    fill: #ccffcc;
`;

type ClickableProps = { $clickable: boolean };

const StringLine = styled.line<ClickableProps>`
    stroke: ${props => props.$clickable ? "black" : "#ccc"};
    stroke-width: ${props => props.$clickable ? "0.8px" : "0.4px"};
`;

const Fret = styled.line< ClickableProps>`
    stroke: ${props => props.$clickable ? "#666666" : "#999999"};
    stroke-width: ${props => props.$clickable ? "0.9px" : "0.7px"};
`;

const Dot = styled.circle`
    fill: #666666;
`;

function range(first: number, last: number): number[] {
    return new Array(last - first + 1).fill(0).map((_val, i) => first + i);
}
