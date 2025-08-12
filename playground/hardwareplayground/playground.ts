import * as Blockly from 'blockly';
import {pythonGenerator} from 'blockly/python';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './workspace/serialization';
import {blocks, forJsBlock,forPyBlock} from "./workspace/blocks/blocks";
import {blocklyOptions, BlocklyTheme} from './workspace/elgotheme';
import {connectSerial, sendCodeToDevice} from "./webserial/webserial";
import {getCodeCompletionCallback, initPlaygroundCommunication} from "@/utils/pg-comm-channel.util";
import {Direction} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";

initBlockly();

export class Playground {
    private workspace: Blockly.WorkspaceSvg;

    constructor(div: HTMLElement, toolbox: Element | any) {
        initPlaygroundCommunication();

        this.workspace = Blockly.inject(div, {
            toolbox: toolbox,
            theme: BlocklyTheme,
            ...blocklyOptions
        });

        const state = Blockly.serialization.workspaces.save(this.workspace);
        Blockly.serialization.workspaces.load(state, this.workspace);
        // load(this.workspace);
    }

    getAsyncCodeWithPredefinedFunctions(blockCode: string): string {
        const codePrefix = `
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\n
        const executeTimeouts = async () => {
        await delay(500);
        \n`
        const codePostfix = `\n
        await delay(500);\n
        handleCodeCompletion();\n }; \n
        return executeTimeouts();`
        let code = codePrefix + blockCode + codePostfix
        console.log(code)
        return code;

    }

    async connectToDevice(onDisconnect:()=>void){
        return connectSerial(onDisconnect)
    }



    getJsCode(): string {
        let code = javascriptGenerator.workspaceToCode(this.workspace);
        code = this.getAsyncCodeWithPredefinedFunctions(code);
        return code
    }

    generateExecJsCode() {
        // eval(code)
        this.executeJsCode(this.getJsCode())

    }

    executeJsCode(code: string, arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0, arg5 = 0): number {
        const something = new Function('arg1', 'arg2', 'arg3', 'arg4', 'arg5', code);
        return something(arg1, arg2, arg3, arg4, arg5);
    }

    generateExecPyCode(): void {
        const code = pythonGenerator.workspaceToCode(this.workspace);
        sendCodeToDevice(code);
    }

}

function initBlockly(): void {
    Blockly.common.defineBlocks(blocks);
    Object.assign(pythonGenerator.forBlock, forPyBlock);
    Object.assign(javascriptGenerator.forBlock, forJsBlock);
}
