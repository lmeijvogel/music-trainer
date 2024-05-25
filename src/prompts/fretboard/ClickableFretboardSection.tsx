import { Scale, Note } from "tonal";
import { calculateFretPosition } from "./calculateFretPosition";
import { activeRectangleTop, displayedFretCount, fullScaleLength, paddingLeft, stringDistance } from "./constants";
import { useCallback } from "react";
import styled from "styled-components";
import { getY } from "./helpers";

type OnStringAndFretClick = (note: string, stringNumber: number, fretNumber: number) => void;

type ClickableFretboardSectionProps = {
    startFret: number;
    endFret: number;
    strings: string[];
    onFretClick: OnStringAndFretClick;
};

export const ClickableFretboardSection = ({
    startFret,
    endFret,
    strings,
    onFretClick
}: ClickableFretboardSectionProps) => {
    const drawActiveRectangle = 0 < startFret || endFret < displayedFretCount;

    const activeRectangleLeft = calculateFretPosition(startFret - 1, fullScaleLength) + paddingLeft;
    const activeRectangleRight = calculateFretPosition(endFret, fullScaleLength) + paddingLeft;

    const activeRectangleHeight = strings.length * stringDistance;
    return (
        <g className="clickable-section">
            <defs>
                <linearGradient id="gradientLeft">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#ccffcc" />
                </linearGradient>
                <linearGradient id="gradientRight">
                    <stop offset="0%" stopColor="#ccffcc" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
            </defs>

            {drawActiveRectangle ? (
                <>
                    <ActiveRectangle
                        x={activeRectangleLeft}
                        y={activeRectangleTop}
                        width={activeRectangleRight - activeRectangleLeft}
                        height={activeRectangleHeight}
                    />
                    {startFret > 0 ? (
                        <FadeoutRectangleLeft
                            width={20}
                            x={activeRectangleLeft}
                            y={activeRectangleTop}
                            height={activeRectangleHeight}
                        />
                    ) : null}

                    {endFret < displayedFretCount ? (
                        <FadeoutRectangleRight
                            width={20}
                            x={activeRectangleRight}
                            y={activeRectangleTop}
                            height={activeRectangleHeight}
                        />
                    ) : null}
                </>
            ) : null}

            {strings.map((note, index) => (
                <ClickableGuitarStringOverlay
                    stringNumber={index}
                    note={note}
                    key={note}
                    firstClickableFret={startFret}
                    lastClickableFret={endFret}
                    onClick={onFretClick}
                />
            ))}
        </g>
    );
};

type ClickableGuitarStringOverlayProps = {
    stringNumber: number;
    note: string;
    onClick: OnStringAndFretClick;
    firstClickableFret: number;
    lastClickableFret: number;
};

const ClickableGuitarStringOverlay = ({
    note,
    stringNumber,
    onClick,
    firstClickableFret,
    lastClickableFret
}: ClickableGuitarStringOverlayProps) => {
    const getAllNotes = (note: string) => Scale.get(`${note} chromatic`).notes;

    const octaveHigher = Note.transposeOctaves(note, 1);

    const notesOnString = [...getAllNotes(note), ...getAllNotes(octaveHigher)].slice(0, displayedFretCount + 1);

    notesOnString.shift();

    return (
        <>
            {firstClickableFret === 0 ? (
                <ClickableRectangle stringNumber={stringNumber} fretNumber={0} note={note} onClick={onClick} />
            ) : null}
            {notesOnString.map((note, position) => {
                const fretNumber = position + 1;

                if (firstClickableFret <= fretNumber && fretNumber <= lastClickableFret) {
                    return (
                        <ClickableRectangle
                            key={note}
                            stringNumber={stringNumber}
                            fretNumber={fretNumber}
                            note={note}
                            onClick={onClick}
                        />
                    );
                }
            })}
            ;
        </>
    );
};

type ClickableRectangleProps = {
    note: string;
    stringNumber: number;
    fretNumber: number;
    onClick: OnStringAndFretClick;
};

const ClickableRectangle = ({ note, stringNumber, fretNumber, onClick }: ClickableRectangleProps) => {
    const onRectClicked = useCallback(() => {
        onClick(note, stringNumber, fretNumber);
    }, [note, stringNumber, fretNumber, onClick]);

    const left = calculateFretPosition(fretNumber - 1, fullScaleLength) + paddingLeft;
    const right = calculateFretPosition(fretNumber, fullScaleLength) + paddingLeft;

    const y = getY(stringNumber);

    return (
        <ClickableRectangleSvg
            onClick={onRectClicked}
            x={left}
            y={y - stringDistance / 2}
            width={right - left}
            height={stringDistance}
        />
    );
};

const FadeoutRectangleLeft = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => {
    return <FadeoutRectangleLeftSvg x={x - width} y={y} width={width} height={height} />;
};

const FadeoutRectangleRight = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => {
    return <FadeoutRectangleRightSvg x={x} y={y} width={width} height={height} />;
};

const ClickableRectangleSvg = styled.rect`
    fill: transparent;
`;

const ActiveRectangle = styled.rect`
    stroke: 1px solid #88ff88;
    fill: #ccffcc;
`;

const FadeoutRectangleLeftSvg = styled.rect`
    fill: url(#gradientLeft);
`;

const FadeoutRectangleRightSvg = styled.rect`
    fill: url(#gradientRight);
`;
