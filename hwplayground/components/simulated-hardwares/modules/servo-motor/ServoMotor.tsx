import {FC} from "react";


export interface ServoState{
    angle:number;
}

export const ServoMotor: FC<ServoState> = ({angle}) => {
    return (
        <div className={'flex flex-col items-center p-2 m-2'}>
            <wokwi-servo horn="single" angle={angle}></wokwi-servo>
        </div>
    )
}