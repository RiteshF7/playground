'use client';

import {FC} from "react";
import '@wokwi/elements';



export interface LCDState {
    text: string,
}


export const LCD: FC<LCDState> = ({text}) => {
    return (
        <wokwi-lcd1602 text={text}></wokwi-lcd1602>
    )
}
