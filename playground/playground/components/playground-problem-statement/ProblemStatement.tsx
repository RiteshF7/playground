import {FC} from "react";
import clsx from "clsx";

export interface ProblemStatementProps {
    problem: string;
    description: string;
}

export const ProblemStatement: FC<ProblemStatementProps> = ({problem, description})=>{
    return (
        <div className={clsx('flex flex-col gap-4 flex-grow text-left items-start')}>
            <p className="text-2xl text-gray-900 dark:text-black">{problem}</p>
            <p className="text-lg text-content-light ">{description}</p>
        </div>
    );
}