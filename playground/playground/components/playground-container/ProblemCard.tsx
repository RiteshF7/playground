import React from 'react';

// TypeScript interface for the problem data
interface ProblemData {
    id: string;
    title: string;
    description: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    tags?: string[];
}

// Props for the ProblemCard component
interface ProblemCardProps {
    problem: ProblemData;
    onSelect?: (id: string) => void;
}

// Separate component for displaying problem details
const ProblemCard: React.FC<ProblemCardProps> = ({problem, onSelect}) => {
    const {id, title, description, difficulty, tags} = problem;

    // Determine background color based on difficulty
    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="flex flex-col bg-gray-200 mr-10 ml-10 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect && onSelect(id)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {difficulty && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getDifficultyColor()}`}>
            {difficulty}
          </span>
                )}
            </div>

            <p className="text-gray-600 mb-3 line-clamp-2">{description}</p>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
              {tag}
            </span>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main component for the horizontal problem list
interface ProblemListProps {
    problems: ProblemData[];
    onSelectProblem?: (id: string) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({problems, onSelectProblem}) => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Problems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map((problem) => (
                    <ProblemCard
                        key={problem.id}
                        problem={problem}
                        onSelect={onSelectProblem}
                    />
                ))}
            </div>
        </div>
    );
};

// Example usage with sample data
const ProblemStatement: React.FC = () => {
    const sampleProblems: ProblemData[] = [
        {
            id: 'p1',
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'Easy',
            tags: ['Array', 'Hash Table']
        },
        {
            id: 'p2',
            title: 'Merge Intervals',
            description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
            difficulty: 'Medium',
            tags: ['Array', 'Sorting']
        },
        {
            id: 'p3',
            title: 'Median of Two Sorted Arrays',
            description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
            difficulty: 'Hard',
            tags: ['Array', 'Binary Search', 'Divide and Conquer']
        }
    ];

    const handleSelectProblem = (id: string) => {
        console.log(`Selected problem with id: ${id}`);
        // Here you could navigate to a detail page or show more info
    };

    return (
        <ProblemCard
            key={"id"}
            problem={sampleProblems[0]}
            onSelect={handleSelectProblem}
        />
    );
};

export default ProblemStatement;