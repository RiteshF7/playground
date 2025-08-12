import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
// @ts-ignore
import {getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";

//block definitions
const blockDefinitions = {

    [BlockKeys.turnServoRight]: {
        "type": blockKeys.turnServoRight,
        "message0": "Turn servo right",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnServoLeft]: {
        "type": blockKeys.turnServoLeft,
        "message0": "Turn servo left",
        "previousStatement": null,
        "nextStatement": null,
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }


}

//toolbox blocks
const toolbox = [
    blockKeys.turnServoLeft,
    blockKeys.turnServoRight,
]


//code generator
const codeGenerator = {
    [blockKeys.turnServoRight]: () => turnServo(ServoDirection.Right),
    [blockKeys.turnServoLeft]: () => turnServo(ServoDirection.Left),
};




enum ServoDirection {
    Right,
    Left
}

function turnServo(direction:ServoDirection){
    switch (direction){
        case ServoDirection.Right:
            return getServoBlockCode('+');
        case ServoDirection.Left:
            return getServoBlockCode('-')
    }
}

function getServoBlockCode(operator:string){
    return `await delay(500);
    degree = (degree ${operator} 45) % 360
    \nawait changeState(${getModuleState(Modules.ServoModule, `{angle:degree}`)});\n`
}

const servoBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: codeGenerator
}

export default servoBlockConfig

