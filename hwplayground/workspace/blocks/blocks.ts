import * as Blockly from 'blockly/core';
import { Block, Generator } from 'blockly/core';

import blockKeys from "./blockKeys";


import neopixelBlockConfig
    from "../../components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";
import ledModuleBlockConfig
    from "../../components/simulated-hardwares/modules/led/ledModuleBlockConfig";
import buzzerBlockConfig
    from "../../components/simulated-hardwares/modules/buzzer/buzzerModuleBlockConfig";
import servoBlockConfig
    from "../../components/simulated-hardwares/modules/servo-motor/servoModuleBlockConfig";
import inputsBlockConfig from "../toolbox/core/inputs/inputsBlockConfig";

import delayBlockConfig from "../../components/simulated-hardwares/modules/common/delayBlockConfig";

interface BlockConfig {
    blockDefinitions?: { [key: string]: any };
    jsCodeGenerator?: { [key: string]: (block: Block, generator: Generator) => any };
    pyCodeGenerator?: { [key: string]: (block: Block, generator: Generator) => any };
    toolBox?: any[];
    [key: string]: any; // Allow additional properties
}


const testBlock = {'type': 'test_block', 'message0': 'example block', 'colour': 160, 'tooltip': '', 'helpUrl': '',};
const blockDefinitionsArray: any[] = [testBlock]


export const blockConfigs: BlockConfig[] = [neopixelBlockConfig, ledModuleBlockConfig, buzzerBlockConfig, servoBlockConfig, inputsBlockConfig,delayBlockConfig]

export const forJsBlock: { [key: string]: (block: Block, generator: Generator) => any } = Object.create(null);
export const forPyBlock: { [key: string]: (block: Block, generator: Generator) => any } = Object.create(null);
const JS_GENERATOR = 'jsCodeGenerator'
const PY_GENERATOR = 'pyCodeGenerator'



for (let key in blockKeys) {
    if (blockKeys.hasOwnProperty(key)) {
        blockConfigs.forEach((blockConfig) => {

            if (blockConfig.blockDefinitions && blockConfig.blockDefinitions.hasOwnProperty(key)) {
                blockDefinitionsArray.push(blockConfig.blockDefinitions[key])
            }

            if (blockConfig.hasOwnProperty(JS_GENERATOR)){
                if (blockConfig.jsCodeGenerator && blockConfig.jsCodeGenerator.hasOwnProperty(key)) {
                    forJsBlock[key] = (blocks, generator) => blockConfig.jsCodeGenerator![key](blocks, generator);
                }
            }
            if (blockConfig.hasOwnProperty(PY_GENERATOR)){
                if (blockConfig.pyCodeGenerator && blockConfig.pyCodeGenerator.hasOwnProperty(key)) {
                    forPyBlock[key] = (blocks, generator) => blockConfig.pyCodeGenerator![key](blocks, generator);
                }
            }


        })
    }
}


export function getSimpleToolboxBlock(blockKey: string) {

    return {
        'kind': 'block',
        'type': blockKey
    }

}

export function getPlainToolBox(blockKeys: string[]) {
    return blockKeys.map((blockKey) => {
        return getSimpleToolboxBlock(blockKey);
    });
}


console.log(blockDefinitionsArray)
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(blockDefinitionsArray);
// export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
//     [testBlock, ...neoPixelBlockDefinitions, ...ledBlockDefinitions, ...servoMotorBlockDefinitions, ...buzzerBlockDefinitions, ...lightBuzzerBlockDefinitation]);

