// types.ts
export interface Position {
    row: number;
    column: number;
}

export enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
    TopLeft = 'TopLeft',
    TopRight = 'TopRight',
    BottomLeft = 'BottomLeft',
    BottomRight = 'BottomRight',
    Stop = 'Stop',
}

export interface TestCase {
    initialState: number[][];
    expectedOutput: number[][] | number[][][];
}

export enum MatrixType {
    UNI_DIRECTIONAL='UNI_DIRECTIONAL',
    BI_DIRECTIONAL='BI_DIRECTIONAL'
}

export enum ControllerType{
    keyboard='keyboard',
    blocks='blocks',
}
