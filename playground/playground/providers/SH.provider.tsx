import {
    GlobalPGCommChannel,
    PlaygroundCommunicationChannel,
    RegisterPlaygroundComponent,
    resetMessageQueue
} from "@/utils/pg-comm-channel.util";
import {createContext, FC, PropsWithChildren, useContext} from "react";
import _ from 'lodash';


interface SHContextProps {
    registerComponent: RegisterPlaygroundComponent;
    initCode: (data: any) => boolean;
    initialUiState: any,
    updateUiState: (componentKey: string, updatedUiState: any) => void;
    checkCompletionStatus: (data: any, successCallback: () => void, failureCallback: () => void) => boolean;
    stopCode: () => void

}

interface ComponentConfigProp {
    initialUiState: any;
    desiredUiState: any;
}

const ShContext = createContext<SHContextProps>({
    registerComponent: () => null,
    initialUiState: null,
    updateUiState: () => null,
    checkCompletionStatus: () => false,
    stopCode: () => null,
    initCode: () => true
});

export const SHProvider: FC<PropsWithChildren<ComponentConfigProp>> = ({initialUiState, desiredUiState, children}) => {

    let uiState = {...initialUiState};
    const codeProgress: any = []
    let step = -1


    function checkCompletionStatus(data: any, successCallback: () => void, failureCallback: () => void): boolean {
        step++
        if (isCodeCompleted(data)) {
            stopCode()
            successCallback()
            return true
        }
        if(!isStepValid(data)){
            stopCode()
            failureCallback()
            return true;
        }

        return false;
    }

    function isStepValid(currentStep: any): boolean {
        let potentialSteps = desiredUiState[step];
        for (let potentialStepIndex = 0; potentialStepIndex < potentialSteps.length; potentialStepIndex++) {
            let potentialStep = potentialSteps[potentialStepIndex];
            if (_.isEqual(currentStep, potentialStep)) {
                return true
            }
        }
        return false;
    }


    //TODO
    //remove this and check
    function updateUiState(componentKey: string, updatedUiState: any) {
        uiState = {...initialUiState, ...{[componentKey]: {...initialUiState[componentKey], ...updatedUiState}}};
        codeProgress.push(uiState)
    }

    //TODO
    //check if any program need init
    function initCode(data: any): boolean {
        return data.hasOwnProperty('init')

    }


    function isOnDesiredState(): boolean {
        return _.isEqual(desiredUiState, codeProgress);

    }

    function isCodeCompleted(data: any): boolean {
        return data.hasOwnProperty('completed')
    }

    function stopCode() {
        step=-1
        codeProgress.length = 0
        resetMessageQueue()
    }


    const registerComponent: RegisterPlaygroundComponent = (key, callback: (data: any) => void) => {
        // @ts-ignore
        (window[GlobalPGCommChannel] as PlaygroundCommunicationChannel).registerComponent(key, callback);
    }


    return (
        <ShContext.Provider
            value={{registerComponent, initialUiState, updateUiState, checkCompletionStatus, stopCode, initCode}}>
            {children}
        </ShContext.Provider>
    )
}

export const useShContext = () => {
    return useContext(ShContext);
}
