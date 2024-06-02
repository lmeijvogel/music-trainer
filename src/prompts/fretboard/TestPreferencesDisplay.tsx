import { FretboardTestSettings } from "./FretboardTestSettings";
import styled from "styled-components";
import { calculateFretPosition } from "./calculateFretPosition";
import { fullScaleLength, paddingLeft } from "./constants";

type Props = { config: FretboardTestSettings; onShowPreferencesDialog: () => void };

export const TestPreferencesDisplay = ({ config, onShowPreferencesDialog }: Props) => {
    const displayablePositions = formatSingleOrRange(config.minPosition, config.maxPosition);
    const displayableStrings = config.strings.map((s) => (s === "E5" ? "e" : s[0]));

    const displayableStringRange = formatSingleOrRange(displayableStrings.at(0), displayableStrings.at(-1));

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <td colSpan={2}>Instellingen</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Snaren:</td>
                        <td>{displayableStringRange}</td>
                    </tr>
                    <tr>
                        <td>Posities:</td>
                        <td>{displayablePositions}</td>
                    </tr>
                </tbody>
            </Table>
            <Pencil onClick={onShowPreferencesDialog} />
        </Container>
    );
};

function formatSingleOrRange(startValue: unknown, endValue: unknown): string {
    return startValue === endValue ? `${startValue}` : `${startValue}-${endValue}`;
}

const Container = styled.div`
    position: absolute;

    top: 20px;
    left: ${calculateFretPosition(2, fullScaleLength) + paddingLeft}px;

    padding: 5px;

    display: flex;

    flex-direction: row;
    justify-content: space-between;

    width: 200px;

    border: 1px solid black;
    border-radius: 3px;

`;

const Table = styled.table`
    text-align: left;
`;

const Pencil = ({ onClick }: { onClick: () => void }) => {
    return (
        <PencilButton onClick={onClick}>
            <svg
                fill="#000000"
                height="20px"
                width="20px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 306.637 306.637"
            >
                <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896    l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095    L265.13,75.602L231.035,41.507z" />
            </svg>
        </PencilButton>
    );
};

const PencilButton = styled.button`
    border: 0px;
    background-color: white;
`;
