import React from 'react';
import { useEffect, useRef } from "react";
import Vex from "vexflow";
import { SingleNotePrompt } from './Prompt';

const vf = Vex.Flow;

type Props = {
    keySignature: string,
    prompt: SingleNotePrompt
};

export const SingleNoteStave: React.FC<Props> = ({ keySignature, prompt }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.innerHTML = "";

        const renderer = new vf.Renderer(ref.current, vf.Renderer.Backends.SVG);

        renderer.resize(300, 150);
        const context = renderer.getContext();

        const stave = new vf.Stave(10, 10, 280);
        stave.addClef("treble").addKeySignature(keySignature);

        stave.setContext(context).draw();
        const note = new vf.StaveNote({ keys: [`${prompt.toVex()}`], duration: "1", auto_stem: true }).setCenterAlignment(true);

        vf.Formatter.FormatAndDraw(context, stave, [note]);
    }, [ref, prompt, keySignature]);

    return <div ref={ref} />
}
