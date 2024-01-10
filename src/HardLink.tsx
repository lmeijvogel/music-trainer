import styled from "styled-components";
import { TestSpec, toLocationBar } from "./helpers/locationBarHelpers";
import { Prompt } from "./prompts/Prompt";
import { useCallback } from "react";

type Props = {
    prompt: Prompt;
    onClick: (testSpec: TestSpec | undefined) => void;
};

export const HardLink = ({ onClick, prompt }: Props) => {
    const onLinkCreate = useCallback(() => {
        onClick(prompt.toTestSpec());
    }, [prompt, onClick]);

    const onLinkClear = useCallback(() => {
        onClick(undefined);
    }, [onClick]);

    return <LinkRow>
        <StyledLink href={"#" + toLocationBar(prompt.toTestSpec())} onClick={onLinkCreate}>hard link</StyledLink>
        <StyledLink href={"#"} onClick={onLinkClear}>clear hard link</StyledLink>
    </LinkRow >;
};

const LinkRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledLink = styled.a`
    color: #666;
    text-decoration: none;
    border: 1px solid #bbb;
    border-radius: 3px;
    padding: 5px;
    user-select: none;
`;


