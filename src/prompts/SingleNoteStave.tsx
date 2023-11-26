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

        renderer.resize(300, 150);
        const context = renderer.getContext();

        const stave = new vf.Stave(10, 10, 280);
        stave.addClef("treble").addKeySignature(prompt.keySignature);

        stave.setContext(context).draw();
        const note = new vf.StaveNote({ keys: [`${prompt.toVex()}`], duration: "1", auto_stem: true }).setCenterAlignment(true);

        vf.Formatter.FormatAndDraw(context, stave, [note]);
    }, [ref, prompt]);

    return <div ref={ref} />
}
