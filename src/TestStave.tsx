import React from 'react';
import { useEffect, useRef } from "react";
import Vex from "vexflow";

const vf = Vex.Flow;

export type Prompt = {
    type: "single";
    note: string;
} | {
    type: "chord";
    name: string;
    notes: string[];
};

type Props = {
    keySignature: string,
    prompt: Prompt
};

export const TestStave: React.FC<Props> = ({ keySignature, prompt }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        if (prompt.type !== "single") return;

        ref.current.innerHTML = "";

        const renderer = new vf.Renderer(ref.current, vf.Renderer.Backends.SVG);

        renderer.resize(300, 150);
        const context = renderer.getContext();

        const stave = new vf.Stave(10, 10, 280);
        stave.addClef("treble").addKeySignature(keySignature);

        stave.setContext(context).draw();

        const notes = [
            new vf.StaveNote({ keys: [`${prompt.note}`], duration: "1", auto_stem: true }).setCenterAlignment(true)
        ];

        vf.Formatter.FormatAndDraw(context, stave, notes);
    }, [ref, prompt, keySignature]);

    return <div ref={ref} />
}
