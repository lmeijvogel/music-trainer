import { FC, Fragment, ReactNode, useCallback } from "react";
import styled from "styled-components";

type Props = {
    onClick: (input: string) => void;
};

const regulars = [2, 3, 6, 7];
const perfects = [1, 4, 5, 8];

export const ResponseButtons: FC<Props> = ({ onClick }) => {
    return <Grid>
        {
            perfects.map(i => <Fragment key={i}>
                <Cell $x={i} $y={1}><Button interval={`A${i}`} onClick={onClick}>{i} Aug</Button></Cell>
                <Cell $x={i} $y={2}><Button interval={`${i}`} onClick={onClick}>{i}</Button></Cell>
                <Cell $x={i} $y={3}><Button interval={`${i}d`} onClick={onClick}>{i} Dim</Button></Cell>
            </Fragment>)
        }
        {
            regulars.map(i => <Fragment key={i}>
                <Cell $x={i} $y={2}><Button interval={`M${i}`} onClick={onClick}>{i} Maj</Button></Cell>
                <Cell $x={i} $y={3}><Button interval={`m${i}`} onClick={onClick}>{i} Min</Button></Cell>
            </Fragment>)
        }</Grid>
};

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(3, 1fr);

    width: 800px;

    padding: 20px 0;
`;

type CellProps = {
    $x: number;
    $y: number;
};

const Cell = styled.div.attrs<CellProps>(({ $x, $y }) => {
    return {
        style: {
            gridColumn: $x,
            gridRow: $y
        }
    };
}) <CellProps>``;

type ButtonProps = {
    interval: string;
    children: ReactNode;
    onClick: (interval: string) => void;
};

const Button: FC<ButtonProps> = ({ interval, children, onClick }) => {
    const buttonClicked = useCallback(() => onClick(interval), [onClick, interval]);

    return <StyledButton onClick={buttonClicked}>{children}</StyledButton>
};

const StyledButton = styled.button`
    display: flex;
    height: 40px; 
    width: 100%;
    align-items: center;
    justify-content: center;
`;
