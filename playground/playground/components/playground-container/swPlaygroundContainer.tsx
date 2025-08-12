'use client';
import React, {FC} from 'react';
import {PlaygroundEditor} from "@/features/playground/components/playground-editor/PlaygroundEditor";
import {PlaygroundProvider} from "@/features/playground/providers/playground.provider";
import {ProblemStatement} from "@/features/playground/components/playground-problem-statement/ProblemStatement";
import {PlaygroundRunner} from "@/features/playground/components/playground-runner/PlaygroundRunner";
import {NeoPixelPlayground} from "@/features/playground/components/playground-container/SoftPlaygroundContainer";

export interface PlaygroundState {
    state: any;
}

export const SWPlayGroundContainer: FC<PlaygroundState> = ({state}) => {
    const [containerState, setContainerState] = React.useState(state);

    return (
        <PlaygroundProvider>
            <div className=" flex-col items-center justify-center ">
                <NeoPixelPlayground state={containerState}/>
            </div>
        </PlaygroundProvider>
    );
};