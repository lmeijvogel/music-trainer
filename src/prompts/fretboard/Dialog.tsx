import { createPortal } from "react-dom";
import styled from "styled-components";

type Props = {
    children: JSX.Element;
};

export const Dialog = ({ children }: Props) => {
    return createPortal(
        <DarkOverlay>
            <ModalDialog>{children}</ModalDialog>
        </DarkOverlay>,
        document.getElementById("overlay")!
    );
};

const DarkOverlay = styled.div`
    position: fixed;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: #444444bb;

    display: flex;

    justify-content: center;
    align-items: center;
`;

const ModalDialog = styled.div`
    display: flex;

    justify-content: center;
    align-items: center;

    background-color: #dddddd;
    border: 1px solid #111111;
    border-radius: 10px;

    min-width: 100px;
    min-height: 100px;
`;
