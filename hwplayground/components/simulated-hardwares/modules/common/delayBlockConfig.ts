import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";

import {
    pyDelay,
    pythonImport,
    PythonImportKey
} from "@/features/playground/components/simulated-hardwares/modules/common/commonModules";

//block definitions
const blockDefinitions = {

    [blockKeys.delay]: {
        "type": blockKeys.delay,
        "message0": "delay %1 ms",
        "args0": [
            {
                "type": "input_value",  
                "name": "DELAY_TIME",   
                "check": "Number"     
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }

}

//toolbox blocks
const toolbox = [
    blockKeys.delay
]


//code generator
// const jsCodeGenerator = {

// };

const pyCodeGenerator = {
    delay: () => pyDelay(1),
};


const delayBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    pyCodeGenerator: pyCodeGenerator
}

export default delayBlockConfig

