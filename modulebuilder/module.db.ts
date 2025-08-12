import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import {
    ControllerType,
    MatrixType
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";

export const stageRefID = "400473830678593602";
export const sectionRefID = "400475005113073730";
export const playgroundRefID = "400480359190364224";

export const localStageData =
    {
        title: "Pro Code",
        description:
            "Requires no coding experience. Suitable for age 9-12. Learn logic building from simple games",
        bgImageUrl: "/stages/category-1.png",
        infoPoints: [
            "Simple Logic Building Games",
            "Suitable for age 9-12",
            "Expert Guided Development",
        ],
        link: "/stages/no-code",
        totalCourses: 10,
        totalDuration: 8,
        level: "1",
    }

    export const sectionTitle = "Loops"








    export const localPlaygroundData =         {
            chapterId: 1,
            type: 'content',
            content: {
                contentId: 0,
                title: "Move pixel 1 step left",
                description: "Move pixel 1 step left",
                media: [
                    {
                        type: "video",
                        url: "",
                        caption: ""
                    }
                ]
            },
            editorConfig: {
                toolboxType: 'flyoutToolbox',
                toolboxContent: [BlockKeys.moveLeft],
            },
            runnerConfig: {
                moduleName: Modules.NeoPixelModule,
                moduleConfig: {
                    matrixSize: 11,
                    matrixType: MatrixType.UNI_DIRECTIONAL,
                    testCase: {
                        initialState: [[5, 5]],
                        expectedOutput: [[5, 4]],
                    },
                    controllerType: ControllerType.blocks
                }
            }
        }



        export const localModuleData = {
            title: "Turn Left",
            description: "This is a sample game 2",
            duration: 10,
    }



