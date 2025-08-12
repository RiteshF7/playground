import NeopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";

interface Toolbox {
    kind: string;
    contents: any[];
}

export const ToolboxContainer: Toolbox = {

    'kind': 'flyoutToolbox',
    'contents': [
        ...NeopixelBlockConfig.toolBox || []
    ]

}
