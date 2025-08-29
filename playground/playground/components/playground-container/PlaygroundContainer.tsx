'use client';
import React, {FC} from 'react';
import {PlaygroundEditor} from "../playground-editor/PlaygroundEditor";
import {PlaygroundProvider} from "../../providers/playground.provider";
import {ProblemStatement} from "../playground-problem-statement/ProblemStatement";
import {PlaygroundContainerContent} from "../../../playground-container.content";
import {PlaygroundRunner} from "../playground-runner/PlaygroundRunner";

interface PlaygroundState{
    state:any
}
export const PlayGroundContainer: FC<PlaygroundState> = ({state}) => {

    const [containerState, setContainerState] = React.useState(state)

    return (

        <PlaygroundProvider>
            <div className={'flex flex-row items-center'}>

                <div className={'flex flex-col flex-grow'}>
                    <ProblemStatement problem={containerState.content.title}
                                      description={containerState.content.description}/>
                    <PlaygroundEditor editorConfig={containerState.editorConfig}/>
                </div>
                <div className="w-1/2">
                    <PlaygroundRunner runnerConfig={containerState.runnerConfig}/>
                </div>

            </div>
        </PlaygroundProvider>

    )
}
