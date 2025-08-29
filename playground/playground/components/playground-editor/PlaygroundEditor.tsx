'use client';
import React, {FC, useEffect, useRef, useState} from "react";
import {usePlayground} from "../../providers/playground.provider";
import {PlaygroundActions} from "../playground-actions/PlaygroundActions";
import {getPlainToolBox, getSimpleToolboxBlock} from "../../../../hwplayground/workspace/blocks/blocks";
import {Button} from "../common/Button";

interface PlaygroundEditorProps {
    editorConfig: any;
}

export const PlaygroundEditor: FC<PlaygroundEditorProps> = ({editorConfig}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initializedEditor = useRef(false);
    const toolboxContainer = {
        'kind': editorConfig.toolboxType,
        'contents': getPlainToolBox(editorConfig.toolboxContent)
    }
    const {initPlayground, connect, isDeviceConnected, runCode} = usePlayground();


    useEffect(() => {
        if (editorRef.current && !initializedEditor.current) {
            initPlayground(editorRef.current, toolboxContainer);
            initializedEditor.current = true;
        }
    }, []);
    return (
        <main className={``}> {/*  Main container */}
            <PlaygroundActions/>
            <div
                ref={editorRef}
                className="bg-gray-300 rounded-lg h-full w-full"
                style={{width: "990px", height: "640px"}}
            />
        </main>

    )
}
