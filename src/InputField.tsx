import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

type Props = {
    onSubmit: (input: string) => void;
    validNotes: string[];
};

export const InputField = React.forwardRef(({ onSubmit, validNotes }: Props, ref) => {
    const inputRef = useRef(null);

    React.useImperativeHandle(ref, () => inputRef.current);

    const [input, setInput] = useState("");

    const isValidNote = useCallback((input: string) => {
        return validNotes.includes(input.toUpperCase());
    }, [validNotes]);

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.key !== "Enter") return;

        if (!isValidNote(input)) return;

        onSubmit(input);

        setInput("");
    }, [input, isValidNote, onSubmit]);


    return <UserInput type="text" ref={inputRef} onKeyDown={onKeyDown} value={input} onInput={e => setInput((e.target as any).value)} />;
})


const UserInput = styled.input`
    border: 0px;
    background-color: transparent;
`;
