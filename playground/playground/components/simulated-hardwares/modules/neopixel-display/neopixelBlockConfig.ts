import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {Direction} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
//block definitions
const blockDefinitions = {

    [blockKeys.moveUp]: {
        "type": blockKeys.moveUp,
        "message0": "Move up",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveDown]: {
        "type": blockKeys.moveDown,
        "message0": "Move down",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveRight]: {
        "type": blockKeys.moveRight,
        "message0": "Move right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    }
    ,

    [blockKeys.moveLeft]: {
        "type": blockKeys.moveLeft,
        "message0": "Move left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveTopLeft]: {
        "type": blockKeys.moveTopLeft,
        "message0": "Move top left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveTopRight]: {
        "type": blockKeys.moveTopRight,
        "message0": "Move top right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveBottomLeft]: {
        "type": blockKeys.moveBottomLeft,
        "message0": "Move bottom left",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },

    [blockKeys.moveBottomRight]: {
        "type": blockKeys.moveBottomRight,
        "message0": "Move bottom right",
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#eaa8a8',
        "tooltip": "",
        "helpUrl": ""
    },


}

//toolbox blocks

function getToolboxBlock(blockKey: string): any {
    return {
        'kind': 'block',
        'type': blockKey
    }

}

const straightToolbox = [
    blockKeys.moveDown,
    blockKeys.moveRight,
    blockKeys.moveUp,
    blockKeys.moveLeft,
]
const verticalToolbox = [
    (blockKeys.moveBottomLeft),
    (blockKeys.moveBottomRight),
    (blockKeys.moveTopLeft),
    (blockKeys.moveTopRight),
]


//code generator
const codeGenerator = {
    moveUp: (blocks: any, generators: any) => getBlockCode(Direction.Up),
    moveDown: (blocks: any, generators: any) => getBlockCode(Direction.Down),
    moveLeft: (blocks: any, generators: any) => getBlockCode(Direction.Left),
    moveRight: (blocks: any, generators: any) => getBlockCode(Direction.Right),
    moveTopLeft: (blocks: any, generators: any) => getBlockCode(Direction.TopLeft),
    moveTopRight: (blocks: any, generators: any) => getBlockCode(Direction.TopRight),
    moveBottomLeft: (blocks: any, generators: any) => getBlockCode(Direction.BottomLeft),
    moveBottomRight: (blocks: any, generators: any) => getBlockCode(Direction.BottomRight),
    stop: (blocks: any, generators: any) => getBlockCode(Direction.Stop),
};

function getBlockCode(payload: Direction) {
    return `await delay(200);\nmove('${payload}');\n`
}

const neopixelBlockConfig = {
    blockDefinitions: blockDefinitions,
    toolBox: straightToolbox,
    jsCodeGenerator: codeGenerator
}

export default neopixelBlockConfig

