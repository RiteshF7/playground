// Define types for our configuration
type MediaItem = {
    type: string;
    url: string;
    caption: string;
};

type PlaygroundConfig = {
    chapterId: number;
    type: string;
    content: {
        contentId: number;
        title: string;
        description: string;
        media: MediaItem[];
    };
    editorConfig: {
        toolboxType: string;
        toolboxContent: string[];
    };
    runnerConfig: {
        moduleName: string;
        moduleConfig: {
            matrixSize: number;
            matrixType: string;
            testCase: {
                initialState: number[][];
                expectedOutput: number[][];
            };
            controllerType: string;
        };
    };
};