'use client';
import React, {FC} from 'react';
import {PlaygroundEditor} from "@/features/playground/components/playground-editor/PlaygroundEditor";
import {PlaygroundProvider} from "@/features/playground/providers/playground.provider";
import {ProblemStatement} from "@/features/playground/components/playground-problem-statement/ProblemStatement";
import {PlaygroundContainerContent} from "@/content/banner-main/playground-container.content";
import {PlaygroundRunner} from "@/features/playground/components/playground-runner/PlaygroundRunner";
import {Button} from "@/features/common/components/button/Button";
import {fetchPlaygroundById} from "@/repositories/playgroundRepo";

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
