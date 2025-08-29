import {FC} from "react";
import {Button} from "../common/Button";
import {usePlayground} from "../../providers/playground.provider";


export const PlaygroundActions: FC = () => {
    const {runCode, connect} = usePlayground();
    return (
        <div className={'flex flex-row items-center gap-4'}>
            <Button uiType={'primary'} onClick={connect}>Connect</Button>
            <Button uiType={'primary'} onClick={()=>runCode()}>Run</Button>
        </div>
    )
}
