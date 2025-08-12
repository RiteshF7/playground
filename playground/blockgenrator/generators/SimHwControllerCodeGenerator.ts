// template.ts
import * as fs from 'fs';


export interface TemplateConfig {
    componentName: string;
    componentKey: string;
    filePath: string;
    controllerData: ControllerData[];
}

export interface ControllerData {
    funcName: string;
    payload: any;
    delay:number
}

export function generateControllerFile(config: TemplateConfig): void {
    const { componentName, componentKey, controllerData} = config;

    const content = controllerData.map((data) => `
    ${data.funcName}: () => getChannelMessageWithDelay('${componentKey}', ${JSON.stringify(data.payload)},${data.delay}),
`).join("");

    const template = `
import { getChannelMessage, getChannelMessageWithDelay } from "@/utils/pg-comm-channel.util";

const ${componentName}Controller = {
${content}
};

export default ${componentName}Controller;
`;

    fs.writeFileSync(`${componentName}Controller.ts`, template);
}


const neoPixelConfig: TemplateConfig = {
    componentName: 'neoPixel',
    filePath: 'src/module/playground/components/simulated-hardwares/neopixel-display/neoPixelController.ts',
    componentKey: 'NEO_PIXEL_MATRIX',
    controllerData: [
        {funcName: "moveUp", payload: {direction: 'Direction.Up'},delay:200},
        {funcName: "moveDown", payload: {direction: 'Direction.Down'},delay:0},
        {funcName: "moveLeft", payload: {direction: 'Direction.Left'},delay:200},
        {funcName: "moveRight", payload: {direction: 'Direction.Right'},delay:200},
        {funcName: "moveTopLeft", payload: {direction: 'Direction.TopLeft'},delay:200},
        {funcName: "moveTopRight", payload: {direction: 'Direction.TopRight'},delay:200},
        {funcName: "moveBottomLeft", payload: {direction: 'Direction.BottomLeft'},delay:200},
        {funcName: "moveBottomRight", payload: {direction: 'Direction.BottomRight'},delay:200},
    ],
};

generateControllerFile(neoPixelConfig);

