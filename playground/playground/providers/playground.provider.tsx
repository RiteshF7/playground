import {createContext, FC, PropsWithChildren, useContext, useState} from "react";
import {Playground} from "@/utils/playground/playground";
import {ToolboxContainer} from "@/utils/playground/workspace/toolbox/toolboxContainer";
import {
    GlobalPGCommChannel,
    PlaygroundCommunicationChannel, RegisterPlaygroundComponent
} from "@/utils/pg-comm-channel.util";

interface PlaygroundContextProps {
    playground: Playground | null;
    initPlayground: (element: HTMLDivElement, toolbox: any) => void;
    runCode: () => void;
    getJsCode: () => string;
    connect: () => void;
    registerComponent: RegisterPlaygroundComponent;
    isDeviceConnected: boolean;
}


const PlaygroundContext = createContext<PlaygroundContextProps>({
    playground: null,
    initPlayground: () => null,
    runCode: () => null,
    getJsCode: () => '',
    connect: () => null,
    registerComponent: () => null,
    isDeviceConnected: false,
});

export const PlaygroundProvider: FC<PropsWithChildren> = ({children}) => {


    const [playgroundInstance, setPlaygroundInstance] = useState<Playground | null>(null);
    const initPlayground = (element: HTMLDivElement, toolbox: any) => {
        setPlaygroundInstance(new Playground(element, toolbox));
    }
    const [isDeviceConnected, setIsDeviceConnected] = useState(false)

    function getJsCode(): string {
        if (playgroundInstance) {
            return playgroundInstance.getJsCode();
        }
        return ''
    }

    const runCode = () => {
        if (playgroundInstance) {
            if (isDeviceConnected){
                playgroundInstance.generateExecPyCode();
                // playgroundInstance.generateExecJsCode();
            }else {
                alert("Please Connect device! If already connected please try reconnecting.")
            }

        }
    }

    const connect = async () => {
        if (playgroundInstance) {
            try {
                const result = await playgroundInstance.connectToDevice(onDisconnect)
                console.log(result,';')
                setIsDeviceConnected(result)

            } catch (e) {
                setIsDeviceConnected(false);
                console.log('e', e);
            }
        }
    };

    function onDisconnect(){
        setIsDeviceConnected(false)
    }



    const registerComponent: RegisterPlaygroundComponent = (key, callback: (data: any) => void) => {
        // @ts-ignore
        (window[GlobalPGCommChannel] as PlaygroundCommunicationChannel).registerComponent(key, callback);
    }

    return (
        <PlaygroundContext.Provider value={{
            playground: playgroundInstance,
            initPlayground,
            runCode,
            getJsCode,
            connect,
            registerComponent,
            isDeviceConnected
        }}>
            {children}
        </PlaygroundContext.Provider>
    )
}


export const usePlayground = () => {
    return useContext(PlaygroundContext);
}
