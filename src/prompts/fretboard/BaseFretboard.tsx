import styled from "styled-components";
import { calculateFretPosition } from "./calculateFretPosition";
import { displayedFretCount, fretBottom, fretMarkerDistance, fretMarkerRadius, fretTop, fullScaleLength, octavePosition, paddingLeft, strings } from "./constants";
import { getY, range } from "./helpers";

function calculateFretCenter(fretNumber: number): number {
    const left = calculateFretPosition(fretNumber - 1, fullScaleLength);
    const right = calculateFretPosition(fretNumber, fullScaleLength);

    return (left + right) / 2;
}

export const BaseFretboard = () => {
    return <StyledBaseFretboard>
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

        <OctaveMarker cx={paddingLeft + calculateFretCenter(12)} cy={fretBottom + fretMarkerDistance} r={fretMarkerRadius} />
    </StyledBaseFretboard>;
}

const StyledBaseFretboard = styled.g`
    pointer-events: none;
`;

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
        })}
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


