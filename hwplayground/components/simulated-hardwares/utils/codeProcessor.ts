import _ from "lodash";
import {usePlayground} from "@/features/playground/providers/playground.provider";
import {delay} from "@/features/playground/components/simulated-hardwares/utils/commonUtils";


interface CallbackHandler {
    onFailure: (message: string) => void,
    onSuccess: (message: string) => void
}

const defaultCallbacks: CallbackHandler = {
    onFailure: (message: string) => {
    },
    onSuccess: (message: string) => {
    }
}

export const defaultStateChangeMethodName = 'changeState'

export async function runTestCases(additionalArgs: object = {}, code: string, testCases: any[], stateUpdater: (state: any) => void
    , callbackHandler: CallbackHandler = defaultCallbacks) {
    let actualState: any[] = []
    let completedTestCases = 0;
    let isFailed = false;

    for (let testcase of testCases) {
        const functionArgs =
            {...additionalArgs, ...testcase.inputs, [defaultStateChangeMethodName]: changeState}
        await executeCode(functionArgs, code, handleCodeCompletion)

    }

    function handleCodeCompletion() {
        processResult(actualState, testCases[completedTestCases].expectedOutput, onFailure, onSuccess)
    }

    function getStateChangeMethodArg(state: Function) {
        //TODO implement this hardcode check !
        if (state.name != defaultStateChangeMethodName) return console.log('please supply stateChangeMethod name as **changeState** as params are hardcoded')
        return {[defaultStateChangeMethodName]: state}
    }

    function changeState(state: any) {
        if (isFailed) return
        actualState.push(state)
        stateUpdater(state)
    }

    function onFailure(message: string) {
        console.log(message)
        if (isFailed) return
        callbackHandler.onFailure(message)
        resetModule()
        isFailed = true
    }


    function onSuccess(message: string) {
        console.log(message)
        actualState = []
        completedTestCases++;
        if (testCases.length === completedTestCases) {
            console.log('All test cases passed!')
            callbackHandler.onSuccess(message)
            resetModule()
            return
        }
        stateUpdater(testCases[completedTestCases].initialState)
    }

    function resetModule() {
        stateUpdater(testCases[0].initialState)
    }

}


export function processResult(actualState: any[], expectedStates: any[], onFailure: (message: string) => void, onSuccess: (message: string) => void) {
    if (actualState.length === 0) return onFailure('No code to execute!')
    if (expectedStates.length === 0 || actualState.length != expectedStates.length) return onFailure('Steps are not equal!')
    if (_.isEqual(actualState, expectedStates)) return onSuccess('Success')
    else return onFailure('Step mismatched!');
}


export async function executeCode(additionalExecCodeArgs: any, code: string, completionHandler: () => void) {
    const functions: any[] = []
    const args: string[] = []
    for (let key in additionalExecCodeArgs) {
        functions.push(additionalExecCodeArgs[key])
        args.push(key)
    }
    if (code != '') {
        let completionHandlerName = 'handleCodeCompletion'
        if (completionHandler.name != completionHandlerName) {
            console.log("please supply codeCompletionHandler function name as **handleCodeCompletion** as params are hardcoded")
            return
        }
        const execute = new Function(...args, 'handleCodeCompletion', code)
        await execute(...functions, completionHandler);
    } else console.log('no code found from Js block code generator!')

}



