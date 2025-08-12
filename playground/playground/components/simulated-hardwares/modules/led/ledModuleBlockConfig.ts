import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {LedState} from "@/features/playground/components/simulated-hardwares/modules/led/Led";
// @ts-ignore
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";
import {
    pyDelay,
    pythonFunction,
    PythonFunctionKey,
    pythonImport,
    PythonImportKey, setPinValue
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";

//block definitions
const blockDefinitions = {

    [BlockKeys.turnOnLed]: {
        "type": blockKeys.turnOnLed,
        "message0": "Turn on led",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnOffLed]: {
        "type": blockKeys.turnOffLed,
        "message0": "Turn off led",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.blinkLed]: {
        "type": blockKeys.blinkLed,
        "message0": "Blink led",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },


}

//toolbox blocks
const toolbox = [
    blockKeys.turnOnLed,
    blockKeys.turnOffLed,
    blockKeys.blinkLed,
]


//code generator
const jsCodeGenerator = {
    turnOnLed: () => getLedBlockCode({active: false, color: 'red'}),
    turnOffLed: () => getLedBlockCode({active: false, color: 'red'}),
    blinkLed: () => getLedBlockCode({active: true, color: 'red'}) + getLedBlockCode({active: false, color: 'red'})
};

const pyCodeGenerator = {
    turnOnLed: () => setPinValue(2,1),
    turnOffLed: () => setPinValue(2,0),
    blinkLed: () => setPinValue(2,1) + pyDelay(1) + setPinValue(2,0),
};




function getLedBlockCode(payload: LedState) {
    return `await delay(400);\nawait changeState(${getModuleState(Modules.LedModule, payload)});\n`
}

const ledBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: jsCodeGenerator,
    pyCodeGenerator: pyCodeGenerator
}

export default ledBlockConfig

