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

    const accidentals = Note.get(note)!.acc;

    // Pad with nonsense "xxx" to make it 1-based
    const column = ["xxx", "C", "D", "E", "F", "G", "A", "B"].indexOf(note[0]);
    const row = accidentals.startsWith("#") ? 1 : accidentals.startsWith("b") ? 3 : 2;

    return <StyledNoteButton $x={column} $y={row} onClick={onButtonClick}>{note}</StyledNoteButton>;
}

const NotesContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(8, 1fr);

    width: 100vw;
`;

type StyledNoteButtonProps = {
    $x: number;
    $y: number;
};

const StyledNoteButton = styled.button.attrs<StyledNoteButtonProps>(({ $x, $y }) => {
    console.log({ $x, $y });
    return {
        style: {
            gridColumn: $x,
            gridRow: $y
        }
    };
}) <StyledNoteButtonProps>`
    width: 100%;
    height: 10vh;

    margin: 5px;

    align-items: center;
`;
