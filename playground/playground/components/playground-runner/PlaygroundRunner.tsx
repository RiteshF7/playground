import React, {FC} from 'react';
import {getModule, Module, Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";

interface PlaygroundRunnerProps {
    runnerConfig: any
}

export const PlaygroundRunner: FC<PlaygroundRunnerProps> = ({runnerConfig}) => {

    const isMultiState = runnerConfig.moduleName === Modules.NeoPixelModule
    return (
        <div
            className={` rounded-xl shadow-lg border border-gray-400 relative p-4`}
            style={{
                backgroundImage: "url('/path/to/tech-background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {isMultiState
                ? getModule(Modules.NeoPixelModule, runnerConfig.moduleConfig)
                : <Module runnerConfig={runnerConfig}/>}
        </div>

    )
}
