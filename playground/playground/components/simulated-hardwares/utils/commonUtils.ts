import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";

export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export const getModuleState = (module:Modules,payload:any)=>{
    if(typeof payload === 'string') return `{'${module}':${payload}}`
    return `{'${module}':${JSON.stringify(payload)}}`
}