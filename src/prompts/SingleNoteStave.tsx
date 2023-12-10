import React from 'react';
import { useEffect, useRef } from "react";
import Vex from "vexflow";
import { Prompt } from './Prompt';

const vf = Vex.Flow;

type Props = {
    prompt: Prompt
};

export const SingleNoteStave: React.FC<Props> = ({ prompt }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.innerHTML = "";

        const renderer = new vf.Renderer(ref.current, vf.Renderer.Backends.SVG);

        renderer.resize(241, 120);
        const context = renderer.getContext();

        const stave = new vf.Stave(10, 0, 230);
        stave.addClef("treble").addKeySignature(prompt.keySignature);

        stave.setContext(context).draw();
        const beats = prompt.toVex().map(notesPerBeat => notesPerBeat.toVex());

        const notes = beats.map(keys => new vf.StaveNote({ keys, duration: "1", auto_stem: true }).setCenterAlignment(true));

        const voice = new vf.Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes);

        vf.Accidental.applyAccidentals([voice], prompt.keySignature);

        new vf.Formatter().joinVoices([voice]).format([voice], 150);

        voice.draw(context, stave);
    }, [ref, prompt]);

    return <div ref={ref} />
}
