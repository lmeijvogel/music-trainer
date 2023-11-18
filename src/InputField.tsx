import React, { forwardRef, KeyboardEventHandler, useCallback, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

type Props = {
    onSubmit: (input: string) => void;
    validNotes: string[];
};

export const InputField = forwardRef(({ onSubmit, validNotes }: Props, ref) => {
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => inputRef.current);

    const [input, setInput] = useState("");

    const isValidNote = useCallback((input: string) => {
        return validNotes.includes(input.toUpperCase());
    }, [validNotes]);

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.key !== "Enter") return;

        if (!isValidNote(input)) return;

        onSubmit(input);

        setInput("");
    }, [input, isValidNote, onSubmit]);


    return <UserInput type="text" ref={inputRef} onKeyDown={onKeyDown} value={input} onInput={e => setInput((e.target as any).value)} />;
})


const UserInput = styled.input`
    background-color: transparent;
    border-radius: 3px;
`;
