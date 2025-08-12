'use client'
import {
    NeoPixelDirect
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/NeoPixelDirect";
import {Buzzer} from "@/features/playground/components/simulated-hardwares/modules/buzzer/Buzzer";
import React, {FC, useState} from "react";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import {
    runTestCases
} from "@/features/playground/components/simulated-hardwares/utils/codeProcessor";
import {Button} from "@/features/common/components/button/Button";
import {Led} from "@/features/playground/components/simulated-hardwares/modules/led/Led";
import {ServoMotor} from "@/features/playground/components/simulated-hardwares/modules/servo-motor/ServoMotor";
import {Block} from "blockly";
import Blockly from "blockly/core";
import {LCD} from "@/features/playground/components/simulated-hardwares/modules/LCD/LCD";
import {Zap} from "lucide-react";

export enum Modules {
    NeoPixelModule = 'neo-pixel-module',
    LedModule = 'led-module',
    NoModule = 'no-module',
    BuzzerModule = 'buzzer-module',
    ServoModule = 'servo-module',
    LCDModule = 'lcd-module'

}

export function getModule(module: Modules = Modules.NoModule, runnerConfig: any) {
    switch (module) {
        case Modules.NeoPixelModule:
            return <NeoPixelDirect  {...runnerConfig}/>
        case Modules.LedModule:
            return <Led {...runnerConfig}/>
        case Modules.BuzzerModule:
            return <Buzzer {...runnerConfig}/>
        case Modules.ServoModule:
            return <ServoMotor {...runnerConfig}/>
        case Modules.LCDModule:
            return <LCD {...runnerConfig}/>
    }
}


interface ModuleProps {
    runnerConfig: any;
}


export const Module: FC<ModuleProps> = ({runnerConfig}) => {
    console.log(runnerConfig, 'runnerConfig')
    const {getJsCode} = usePlayground();
    const [moduleState, setModuleState] = useState(runnerConfig.moduleConfig.testCases[0].initialState)

    function updateState(state: any) {
        setModuleState((prevState: any) => {
            return {
                ...prevState,
                ...state
            };
        });

    }

    function runCode() {
        runTestCases({}, getJsCode(), runnerConfig.moduleConfig.testCases, updateState).then(r => console.log(r))
    }


    return (
        <div className={'flex flex-col items-center p-2 m-2'}>
            {
                runnerConfig.moduleNames.map((module: Modules) => {
                    return <div key={module}> {getModule(module, moduleState[module])}</div>
                })
            }
            <RunButton onClick={runCode}/>

        </div>
    )
}


type ButtonProps = {
    onClick: () => void; // Callback function for button click
};

const RunButton: FC<ButtonProps> = ({onClick}) => {
    return (
        <button
            className="bg-green-400 ml-2 mt-2 hover:bg-green-500 text-white px-4 py-2 rounded-md flex items-center shadow-md transition duration-200"

            onClick={onClick}
        >
            <Zap size={16} className="mr-2"/>
            RUN
        </button>
    );
};

export default RunButton;

