'use client';
import React, {FC, useState} from 'react';
import {PlayGroundContainer} from './PlaygroundContainer';
import {PlaygroundContainerContent} from '../../../playground-container.content';
import {Button} from '../common/Button';

export const PlaygroundTestWrapper: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalChallenges = PlaygroundContainerContent.length;

    const currentChallenge = PlaygroundContainerContent[currentIndex];

    const goToNext = () => {
        if (currentIndex < totalChallenges - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToChallenge = (index: number) => {
        if (index >= 0 && index < totalChallenges) {
            setCurrentIndex(index);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Navigation Header */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Playground Test Wrapper
                    </h1>
                    <div className="text-sm text-gray-600">
                        Challenge {currentIndex + 1} of {totalChallenges}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-4 mb-4">
                    <Button 
                        uiType="secondary" 
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                    >
                        ← Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Go to:</span>
                        <select 
                            value={currentIndex}
                            onChange={(e) => goToChallenge(parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                            {PlaygroundContainerContent.map((_, index) => (
                                <option key={index} value={index}>
                                    Challenge {index + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button 
                        uiType="secondary" 
                        onClick={goToNext}
                        disabled={currentIndex === totalChallenges - 1}
                    >
                        Next →
                    </Button>
                </div>

                {/* Challenge Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                    <h2 className="font-semibold text-blue-800 mb-1">
                        {currentChallenge.content.title}
                    </h2>
                    <p className="text-blue-700 text-sm">
                        {currentChallenge.content.description}
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                        <span className="font-medium">Chapter ID:</span> {currentChallenge.chapterId} | 
                        <span className="font-medium ml-2">Type:</span> {currentChallenge.type} |
                        <span className="font-medium ml-2">Toolbox:</span> {currentChallenge.editorConfig.toolboxType}
                    </div>
                </div>
            </div>

            {/* Playground Container */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <PlayGroundContainer state={currentChallenge} />
            </div>

            {/* Footer with Quick Navigation */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Navigation</h3>
                <div className="grid grid-cols-6 gap-2">
                    {PlaygroundContainerContent.map((challenge, index) => (
                        <button
                            key={index}
                            onClick={() => goToChallenge(index)}
                            className={`px-3 py-2 text-xs rounded-md transition-colors ${
                                index === currentIndex
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title={challenge.content.title}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
