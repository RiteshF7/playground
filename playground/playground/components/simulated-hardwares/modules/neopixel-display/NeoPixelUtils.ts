import {Direction, Position} from './types';

export function calculateMove(direction: Direction, position: number[]): number[] {
    const verticalOffset = getVerticalOffset(direction);
    const horizontalOffset = getHorizontalOffset(direction);

    const newRow = position[0] + verticalOffset;
    const newColumn = position[1] + horizontalOffset;

    return [newRow,newColumn]
}

export function isValidPosition(row: number, column: number, matrixSize: number): boolean {
    return row >= 0 && row < matrixSize && column >= 0 && column < matrixSize;
}

function getVerticalOffset(direction: Direction): number {
    switch (direction) {
        case Direction.Up:
        case Direction.TopLeft:
        case Direction.TopRight:
            return -1;
        case Direction.Down:
        case Direction.BottomLeft:
        case Direction.BottomRight:
            return 1;
        default:
            return 0;
    }
}

function getHorizontalOffset(direction: Direction): number {
    switch (direction) {
        case Direction.Left:
        case Direction.TopLeft:
        case Direction.BottomLeft:
            return -1;
        case Direction.Right:
        case Direction.TopRight:
        case Direction.BottomRight:
            return 1;
        default:
            return 0;
    }
}


