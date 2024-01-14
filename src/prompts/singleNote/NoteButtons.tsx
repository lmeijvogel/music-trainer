import { useCallback } from "react";
import styled from "styled-components";
import { Note, Scale } from "tonal";
import { correctForKey } from "../../helpers/correctForKey";

type Props = {
    keySignature: string;
    onSubmit: (input: string) => void;
};

export function NoteButtons({ keySignature, onSubmit }: Props) {
    const allNotes = Scale.get("C3 chromatic");

    return <NotesContainer>
        {allNotes.notes.map(note => <NoteButton key={note} note={Note.pitchClass(correctForKey(note, keySignature))} onClick={onSubmit} />)}
    </NotesContainer>
}

type NoteButtonProps = {
    note: string;
    onClick: (note: string) => void;
};

function NoteButton({ note, onClick }: NoteButtonProps) {
    const onButtonClick = useCallback(() => onClick(note), [note, onClick]);

    return <StyledNoteButton onClick={onButtonClick}>{note}</StyledNoteButton>;
}

const NotesContainer = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: center;

    width: 100vw;
`;

const StyledNoteButton = styled.button`
    display: flex;
    width: 100%;
    height: 10vh;

    margin: 5px;

    align-items: center;
`;
