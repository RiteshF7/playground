import {forPyBlock} from "@/utils/playground/workspace/blocks/blocks";
import {pythonGenerator} from "blockly/python";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";

export enum PythonImportKey {
    MACHINE,
    PIN,
    TIME
}

export function pythonImport(key: PythonImportKey) {
    switch (key) {
        case PythonImportKey.PIN:
            pythonGenerator.definitions_['import_pin'] = 'from machine import Pin';
            break;
        case PythonImportKey.MACHINE:
            pythonGenerator.definitions_['import_machine'] = 'import machine';
            break;
        case PythonImportKey.TIME:
            pythonGenerator.definitions_['import_time'] = 'import time';
            break;
    }
}

export function setPinValue(pin:number,value: number) {
    pythonImport(PythonImportKey.PIN)
    pythonFunction(PythonFunctionKey.GPIO_SET)
    return 'gpio_set(' + pin + ', ' + value + ')\n';
}

export function pyDelay(value: number) {
    pythonImport(PythonImportKey.TIME)
    return 'time.sleep(' + value + ')\n';
}


export enum PythonFunctionKey{
    GPIO_SET
}

export function pythonFunction(key: PythonFunctionKey) {
    switch (key){
        case PythonFunctionKey.GPIO_SET:
            pythonGenerator.definitions_['gpio_set'] = 'def gpio_set(pin,value):\n  if value >= 1:\n    Pin(pin, Pin.OUT).on()\n  else:\n    Pin(pin, Pin.OUT).off()';

    }
}


