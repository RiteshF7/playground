import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";

// @ts-ignore
import {getSimpleToolboxBlock} from "@/utils/playground/workspace/blocks/blocks";
import {BuzzerState} from "@/features/playground/components/simulated-hardwares/modules/buzzer/Buzzer";
import {getModuleState} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import ModuleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";
import moduleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";
import {
    pythonFunction, PythonFunctionKey,
    pythonImport,
    PythonImportKey, setPinValue
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";


//block definitions
const blockDefinitions = {

    [BlockKeys.turnOnBuzzer]: {
        "type": blockKeys.turnOnBuzzer,
        "message0": "Turn on Buzzer",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },
    [BlockKeys.turnOffBuzzer]: {
        "type": blockKeys.turnOffBuzzer,
        "message0": "Turn off Buzzer",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }


}


//toolbox blocks


const toolbox = [
    blockKeys.turnOnBuzzer,
    blockKeys.turnOffBuzzer,
]


//code generator
const pyCodeGenerator = {
    [blockKeys.turnOnBuzzer]: () => getBuzzerBlockCode({buzz: true}),
    [blockKeys.turnOffBuzzer]: () => getBuzzerBlockCode({buzz: false}),
};

//code generator
const jsCodeGenerator = {
    [blockKeys.turnOnBuzzer]: () => setPinValue(8, 1),
    [blockKeys.turnOffBuzzer]: () => setPinValue(8, 0),
};


function getBuzzerBlockCode(payload: BuzzerState) {
    return `await delay(500);\nawait changeState(${getModuleState(Modules.BuzzerModule, payload)});\n`
}

const buzzerBlockConfig = {
    [moduleConfigConstants.BLOCK_DEFINITIONS]: blockDefinitions,
    [ModuleConfigConstants.TOOLBOX]: toolbox,
    [ModuleConfigConstants.PY_CODE_GENERATOR]: pyCodeGenerator,
    [ModuleConfigConstants.JS_CODE_GENERATOR]: jsCodeGenerator
}

export default buzzerBlockConfig

