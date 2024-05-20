import styled from "styled-components";

type Props = {
    text: string | undefined;
};

export const ErrorDisplay = ({ text }: Props) => {
    if (!text) {
        return <StyledErrorDisplay $visible={false}> </StyledErrorDisplay>;
    }

    return <StyledErrorDisplay $visible={true}>{text}</StyledErrorDisplay>;
}

const StyledErrorDisplay = styled.div<{ $visible: boolean; }>`
    position: fixed;
    width: 100%;

    background-color: red;
    color: black;
    line-height: 1.5em;
    height: 1.5em;
    visibility: ${(props) => props.$visible ? "visible" : "hidden"};
`;

