import { useCallback, useEffect, useState } from "react";
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

const strings = ["E5", "B4", "G4", "D4", "A3", "E3"];
const fretPadding = 1;
const fretTop = paddingTop - fretPadding;

const fretBottom = (strings.length - 1) * stringDistance + paddingTop + fretPadding;

const activeRectangleTop = paddingTop - stringDistance / 2;
const activeRectangleBottom = paddingTop + (strings.length - 0.5) * stringDistance;

type OnNoteClick = (note: string) => "good" | "bad" | undefined;

type OnStringAndFretClick = (note: string, stringNumber: number, fretNumber: number) => void;

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

type ClickedFret = {
    stringNumber: number;
    fretNumber: number;
    result: "good" | "bad";
};

type ClickedFretWithId = ClickedFret & { id: string };

function WithClickedFretList(): [ClickedFretWithId[], (clickedFret: ClickedFret) => void, (clickedFret: ClickedFretWithId) => void] {
    const [clickedFrets, setClickedFrets] = useState<ClickedFretWithId[]>([]);


    const addClickedFret = (clickedFret: ClickedFret) => {
        const randomId = crypto.randomUUID();

        const entryWithId = { ...clickedFret, id: randomId };

        setClickedFrets([...clickedFrets, entryWithId]);
    };

    const removeClickedFret = (clickedFret: ClickedFretWithId) => {
        setClickedFrets([...clickedFrets.filter(fret => clickedFret.id !== fret.id)]);
    };

    return [clickedFrets, addClickedFret, removeClickedFret];
}

export const Fretboard = ({ onNoteClick, startFret = 0, endFret = displayedFretCount }: Props) => {
    const [clickedFrets, addClickedFret, removeClickedFret] = WithClickedFretList();

    const onFretClick: OnStringAndFretClick = useCallback((note: string, stringNumber: number, fretNumber: number) => {
        const result = onNoteClick(note);

        if (!result) return;

        addClickedFret({ stringNumber, fretNumber, result });
    }, [onNoteClick, addClickedFret]);



    const lastFretX = calculateFretPosition(displayedFretCount, fullScaleLength);

    const maxStringX = paddingLeft + lastFretX;

    const activeRectangleLeft = calculateFretPosition(startFret - 1, fullScaleLength) + paddingLeft;
    const activeRectangleRight = calculateFretPosition(endFret, fullScaleLength) + paddingLeft;

    const drawActiveRectangle = 0 < startFret || endFret < displayedFretCount;

    return <FretboardSvg viewBox={`0 0 ${maxStringX + 10} ${stringDistance * strings.length + fretMarkerDistance + fretMarkerRadius * 2 + 10}`}>
        {drawActiveRectangle ? <ActiveRectangle x={activeRectangleLeft} y={activeRectangleTop} width={activeRectangleRight - activeRectangleLeft} height={activeRectangleBottom - activeRectangleTop} /> : null}

        <BaseFretboard />

        <ClickableSection startFret={startFret} endFret={endFret} onNoteClick={onNoteClick} onFretClick={onFretClick} />

        {clickedFrets.map(clickedFret => <ClickedRectangle key={clickedFret.id} clickedSquare={clickedFret} afterFadeout={removeClickedFret} />)}
    </FretboardSvg>;
}

const FretboardSvg = styled.svg`
    width: 100vw;
`;

const BaseFretboard = () => {
    return <g className="baseFretboard">
        {strings.map((note, index) => (
            <GuitarString key={note} stringNumber={index} />
        ))}

        {range(0, 12).map(fretNumber => {
            const x = calculateFretPosition(fretNumber, fullScaleLength);

            return <Fret key={fretNumber} x1={paddingLeft + x} x2={paddingLeft + x} y1={fretTop} y2={fretBottom} />
        })}
        {range(1, displayedFretCount - 12).map(fretNumber => {
            // Above the octave
            const x = calculateFretPosition(fretNumber, fullScaleLength / 2);

            return <Fret key={fretNumber} x1={octavePosition + paddingLeft + x} x2={octavePosition + paddingLeft + x} y1={fretTop} y2={fretBottom} />
        })}

        {[3, 5, 7, 9, 15, 17, 19, 22].filter(n => n <= displayedFretCount).map(fretNumber => {
            const fretPosition = calculateFretCenter(fretNumber);

            return <Dot key={fretNumber} cx={paddingLeft + fretPosition} cy={fretBottom + fretMarkerDistance} r={fretMarkerRadius} />;
        })}

        <OctaveMarker cx={paddingLeft + calculateFretCenter(12)} cy={fretBottom + fretMarkerDistance} r={fretMarkerRadius} />;
    </g>;
}

type GuitarStringProps = {
    stringNumber: number;
};

const GuitarString = ({ stringNumber }: GuitarStringProps) => {
    const y = getY(stringNumber);

    return <>
        {range(0, displayedFretCount - 1).map((_, position) => {
            const fret = position + 1;
            const xLeft = calculateFretPosition(fret - 1, fullScaleLength) + paddingLeft;
            const xRight = calculateFretPosition(fret, fullScaleLength) + paddingLeft;

            return <StringLine key={position} x1={xLeft} x2={xRight} y1={y} y2={y} />;
        })};
    </>;
};

const StringLine = styled.line`
    stroke: black;
    stroke-width: 0.8px;
    pointer-events: none;
`;

const Fret = styled.line`
    stroke: #666666;
    stroke-width: 0.9px;
    pointer-events: none;
`;

const Dot = styled.circle`
    fill: #666666;
`;

const OctaveMarker = ({ cx, cy, r }: { cx: number, cy: number, r: number }) => {
    return <>
        <Dot cx={cx - (r * 1.1)} cy={cy} r={r} />
        <Dot cx={cx + (r * 1.1)} cy={cy} r={r} />
    </>;
}

const ClickableSection = ({ startFret, endFret, onFretClick }: { startFret: number; endFret: number; onNoteClick: OnNoteClick, onFretClick: OnStringAndFretClick }) => {
    return <g className="clickable-section">
        {strings.map((note, index) => (
            <ClickableGuitarStringOverlay stringNumber={index} note={note} key={note} firstClickableFret={startFret} lastClickableFret={endFret} onClick={onFretClick} />
        ))}
    </g>
}

type ClickableGuitarStringOverlayProps = GuitarStringProps & {
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
    clickedSquare: ClickedFretWithId | undefined;
    afterFadeout: (clickedFret: ClickedFretWithId) => void;
};


const ClickedRectangle = ({ clickedSquare, afterFadeout }: ClickedRectangleProps) => {
    const [hidden, setHidden] = useState<boolean>(clickedSquare?.result !== undefined);

    useEffect(() => {
        setHidden(false);

        const timeout = setTimeout(() => {
            // Keep wrong answers visible
            if (clickedSquare?.result === "good") {
                setHidden(true)
            }
        }, 10);

        return () => { console.log("Unmounting component", clickedSquare?.stringNumber, clickedSquare?.fretNumber); clearTimeout(timeout); };
    }, [clickedSquare]);

    const onTransitionEnd = useCallback(() => {
        if (clickedSquare) afterFadeout(clickedSquare);
    }, [clickedSquare, afterFadeout]);

    if (!clickedSquare) {
        return null;
    }

    const left = calculateFretPosition(clickedSquare.fretNumber - 1, fullScaleLength) + paddingLeft;
    const right = calculateFretPosition(clickedSquare.fretNumber, fullScaleLength) + paddingLeft;

    const y = getY(clickedSquare.stringNumber);

    return <ClickedRectangleSvg
        x={left}
        y={y - stringDistance / 2}
        width={right - left}
        height={stringDistance}
        $result={clickedSquare.result}
        $hidden={hidden}
        onTransitionEnd={onTransitionEnd}
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

const ClickedRectangleSvg = styled.rect<{ $result: "good" | "bad" | undefined, $hidden: boolean }>`
    stroke: ${props => props.$hidden ? "transparent" : props.$result === "good" ? "#55ff55" : props.$result === "bad" ? "#ff0000" : "transparent"};
    ${props => props.$hidden ? "transition: stroke 0.5s,stroke-width 0.51s" : ""};
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

function range(first: number, last: number): number[] {
    return new Array(last - first + 1).fill(0).map((_val, i) => first + i);
}

function getY(stringNumber: number): number {
    return stringNumber * stringDistance + paddingTop;
}
