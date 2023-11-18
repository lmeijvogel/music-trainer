import React from 'react';
import { useEffect, useRef } from "react";
import Vex from "vexflow";

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

        console.log("Ref: ", ref.current.id);
        ref.current.innerHTML = "";

        const { Factory } = Vex.Flow;

        const vf = new Factory({ renderer: { elementId: ref.current.id } });
        const score = vf.EasyScore();
        const system = vf.System();

        const notes = prompt.type === "single" ? score.voice(score.notes(`${prompt.note}/w`, { stem: "down" }), {}) : "null";
        system.addStave({
            voices: [
                notes
            ]
        }).addClef('treble').addKeySignature(keySignature).addTimeSignature('4/4');

        vf.draw();
    }, [ref, prompt, keySignature]);

    return <div ref={ref} id="theElement" />
}
