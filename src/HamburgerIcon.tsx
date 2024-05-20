import styled from "styled-components";

type Props = {
    onClick: () => void;
};

export const HamburgerIcon = ({ onClick }: Props) => {
    return <StyledButton onClick={onClick}><StyledSvg viewBox="0 0 24 24">
        <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    </StyledSvg></StyledButton>;
}

const StyledButton = styled.button`
    position: fixed;

    top: 20px;
    right: 20px;

    border: 2px solid #8888ff;
    border-radius: 3px;

    background-color: white;
`;

const StyledSvg = styled.svg`
    width: 20px;
    height: 20px;

    padding: 4px;
`;
