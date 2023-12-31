import { forwardRef, KeyboardEventHandler, useCallback, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

type Props = {
    onSubmit: (input: string) => void;
    validator?: (input: string) => boolean;
};

export const InputField = forwardRef(({ onSubmit, validator }: Props, ref) => {
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => inputRef.current);

    const [input, setInput] = useState("");

    const isValidNote = useCallback((input: string) => {
        return !validator || validator(input);
    }, [validator]);

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.key !== "Enter") return;

        if (!isValidNote(input)) return;

        onSubmit(input);

        setInput("");
    }, [input, isValidNote, onSubmit]);


    return <UserInput type="text" ref={inputRef} onKeyDown={onKeyDown} value={input} onInput={e => setInput((e.target as HTMLInputElement).value)} />;
})


const UserInput = styled.input`
    background-color: transparent;
    border-radius: 3px;

    margin: 10px;
`;
