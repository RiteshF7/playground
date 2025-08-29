import blockKeys from "../../../blocks/blockKeys";
import BlockKeys from "../../../blocks/blockKeys";
import {LedState} from "../../../components/simulated-hardwares/modules/led/Led";
// @ts-ignore
import {getSimpleToolboxBlock} from "../../../blocks/blocks";
import {Modules} from "../../../components/simulated-hardwares/utils/modulesMap";
import {getModuleState} from "../../../components/simulated-hardwares/utils/commonUtils";
import Blockly from "blockly/core";
import {JavaScript} from "blockly";
import {Order} from "blockly/javascript";
//block definitions
const blockDefinitions = {

    [BlockKeys.lightValue]: {
        "type": blockKeys.lightValue,
        "message0": "light value",
        "output": "Number",
"colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

}

//toolbox blocks
const toolbox = [
    blockKeys.lightValue,
]


//code generator
const codeGenerator = {
    lightValue: (blocks:any,generators:any) => {
        var code = 'lightValue';
        return [code, generators.ORDER_NONE];
    }
};


const inputsBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: toolbox,
    jsCodeGenerator: codeGenerator
}

export default inputsBlockConfig

