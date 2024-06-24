import React, { useCallback, useState } from 'react';
import { useEffect, useRef } from "react";
import Vex from "vexflow";
import { Prompt } from './Prompt';
import { Direction } from 'tonal';

const vf = Vex.Flow;

type Props = {
    prompt: Prompt,
    onKeyChange: (direction: Direction) => void;
};

const WHEEL_THRESHOLD = 1000;

function useWheel(callback: (direction: Direction) => void) {
    const [wheelCount, setWheelCount] = useState(0);

    const onWheel = useCallback((deltaY: number) => {
        // Direction changed
        if (deltaY * wheelCount < 0) setWheelCount(0);

        setWheelCount(wheelCount + deltaY);

        if (wheelCount < -WHEEL_THRESHOLD) {
            callback(1);
            setWheelCount(0);
        }


        if (WHEEL_THRESHOLD < wheelCount) {
            callback(-1);
            setWheelCount(0);
        }
    }, [callback, wheelCount]);

    return onWheel;
}

export const SingleNoteStave: React.FC<Props> = ({ prompt, onKeyChange }) => {
    const onWheel = useWheel(onKeyChange);

    const ref = useRef<HTMLDivElement>(null);

    const onWheelEvent = useCallback((event: WheelEvent) => {
        onWheel(event.deltaY)
    }, [onWheel]);

    useEffect(() => {
        if (!ref.current) return;

        const currentRef = ref.current;

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

        ref.current.addEventListener("wheel", onWheelEvent);

        voice.draw(context, stave);

        return () => currentRef.removeEventListener("wheel", onWheelEvent);
    }, [ref, prompt, onWheel, onWheelEvent]);

    return <div ref={ref} />
}
