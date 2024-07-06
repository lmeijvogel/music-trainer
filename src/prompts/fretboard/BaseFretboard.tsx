import styled from "styled-components";
import { calculateFretPosition } from "./calculateFretPosition";
import {
    displayedFretCount,
    fretMarkerDistance,
    fretMarkerRadius,
    fretPadding,
    fretTop,
    fullScaleLength,
    octavePosition,
    paddingLeft,
    paddingTop,
    strings
} from "./constants";
import { getY, range } from "./helpers";
import { useStringDistance } from "../../hooks/useStringDistance";

function calculateFretCenter(fretNumber: number): number {
    const left = calculateFretPosition(fretNumber - 1, fullScaleLength);
    const right = calculateFretPosition(fretNumber, fullScaleLength);

    return (left + right) / 2;
}

export const BaseFretboard = () => {
    const stringDistance = useStringDistance();

    const fretBottom = (strings.length - 1) * stringDistance + paddingTop + fretPadding;

    return (
        <StyledBaseFretboard>
            {strings.map((note, index) => (
                <GuitarString key={note} stringNumber={index} />
            ))}

            {range(0, 12).map((fretNumber) => {
                const x = calculateFretPosition(fretNumber, fullScaleLength);

                return <Fret key={fretNumber} x1={paddingLeft + x} x2={paddingLeft + x} y1={fretTop} y2={fretBottom} />;
            })}
            {range(1, displayedFretCount - 12).map((fretNumber) => {
                // Above the octave
                const x = calculateFretPosition(fretNumber, fullScaleLength / 2);

                return (
                    <Fret
                        key={fretNumber}
                        x1={octavePosition + paddingLeft + x}
                        x2={octavePosition + paddingLeft + x}
                        y1={fretTop}
                        y2={fretBottom}
                    />
                );
            })}

            {[3, 5, 7, 9, 15, 17, 19, 22]
                .filter((n) => n <= displayedFretCount)
                .map((fretNumber) => {
                    return <Dot key={fretNumber} fretNumber={fretNumber} fretBottom={fretBottom} />;
                })}

            <DoubleDot fretNumber={12} fretBottom={fretBottom} />
        </StyledBaseFretboard>
    );
};

const StyledBaseFretboard = styled.g`
    pointer-events: none;
`;

type GuitarStringProps = {
    stringNumber: number;
};

const GuitarString = ({ stringNumber }: GuitarStringProps) => {
    const stringDistance = useStringDistance();

    const fretLabelX = calculateFretPosition(-0.2, fullScaleLength) + paddingLeft;
    const y = getY(stringNumber, stringDistance);

    const stringNote = strings[stringNumber];

    const label = stringNote === "E5" ? "e" : stringNote[0];

    return (
        <>
            <StringLabel x={fretLabelX} y={y} dominantBaseline="middle">
                {label}
            </StringLabel>
            {range(0, displayedFretCount - 1).map((_, position) => {
                const fret = position + 1;
                const xLeft = calculateFretPosition(fret - 1, fullScaleLength) + paddingLeft;
                const xRight = calculateFretPosition(fret, fullScaleLength) + paddingLeft;

                return <StringLine key={position} x1={xLeft} x2={xRight} y1={y} y2={y} $width={stringWidth(stringNumber)} />;
            })}
        </>
    );
};

function stringWidth(index: number): number {
    switch (index) {
        case 5: return 1.7;
        case 4: return 1.5;
        case 3: return 1.4;
        default: return 1;
    }
}

const StringLabel = styled.text`
    font-size: 10px;
`;

const StringLine = styled.line<{ $width: number }>`
    stroke: black;
    stroke-width: ${props => props.$width * 0.8}px;
    pointer-events: none;
`;

const Fret = styled.line`
    stroke: #666666;
    stroke-width: 0.9px;
    pointer-events: none;
`;

const Dot = ({ fretNumber, fretBottom }: { fretNumber: number; fretBottom: number }) => {
    const fretPosition = calculateFretCenter(fretNumber);

    return (
        <FretMarkerText x={paddingLeft + fretPosition} y={fretBottom + fretMarkerDistance}>
            {fretNumber}
        </FretMarkerText>
    );
};

const DoubleDot = ({ fretNumber, fretBottom }: { fretNumber: number; fretBottom: number }) => {
    // To be honest, I don't know why 2 * fretMarkerRadius from cy, but it looks OK.
    return (
        <OctaveMarker
            cx={paddingLeft + calculateFretCenter(fretNumber)}
            cy={fretBottom + fretMarkerDistance - 2 * fretMarkerRadius}
            r={fretMarkerRadius}
        />
    );
};

const FretMarkerText = styled.text`
    font-size: 8px;
    text-anchor: middle;
`;

const StyledDot = styled.circle`
    fill: #666666;
`;

const OctaveMarker = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
    return (
        <>
            <StyledDot cx={cx - r * 1.1} cy={cy} r={r} />
            <StyledDot cx={cx + r * 1.1} cy={cy} r={r} />
        </>
    );
};
