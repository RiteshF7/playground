'use client';

import {FC} from "react";
import '@wokwi/elements';



export interface LedState {
    color: string,
    active: boolean
}


export const Led: FC<LedState> = ({color,active}) => {
    return (
        <wokwi-led color={color} value={active ? true : undefined}></wokwi-led>
    )
}
