import {usePlayground} from "@/features/playground/providers/playground.provider";
import _ from "lodash";

interface ModuleBaseViewModelProps {
    handleFailure: (message: string) => null;
    handleSuccess: (message: string) => null;
}

interface CompletionStatus {
    status: boolean;
    message: string;

}

export const useModuleBaseViewModel = () => {
    const {getJsCode} = usePlayground();

    function getCompletionStatus(expectedPixelPath: any[], actualPixelPath: any[]): CompletionStatus {
        if (actualPixelPath.length === 0) return {status: false, message: 'No code to execute!'}
        if (expectedPixelPath.length === 0 || actualPixelPath.length != expectedPixelPath.length) return {
            status: false,
            message: 'Steps not as expected!'
        }
        if (_.isEqual(actualPixelPath, expectedPixelPath)) return {status: true, message: 'proceed to next chapter'}
        else return {status: false, message: 'Steps not as expected!'}
    }

    function executeCode(functions: any[], args: string[], completionHandler: () => void) {
        let code = getJsCode()
        if(code!=''){
            let completionHandlerName = 'handleCodeCompletion'
            if(completionHandler.name != completionHandlerName){
                console.log("please supply codeCompletionHandler function name as **handleCodeCompletion** as params are hardcoded")
                return
            }
            const execute = new Function(...args, 'handleCodeCompletion', code)
            execute(...functions, completionHandler);
        }
        else console.log('no code found from Js block code generator!')

    }


    return {getCompletionStatus,executeCode}
}