import React from 'react';
import {Zap} from "lucide-react";

interface NavigationProps {
    onSuccess?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSuccess }) => {
    // Navigation functions using window.location instead of router
    const goToNextPage = () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        window.location.href = `/swplayground/${currentPage + 1}`;

        if (onSuccess) {
            onSuccess();
        }
    };

    const goToPreviousPage = () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        if (currentPage > 1) {
            window.location.href = `/swplayground/${currentPage - 1}`;
        }
    };

    return (
        <div className="flex justify-between mt-2">

            <button
                className="bg-red-400 mr-5 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                onClick={goToPreviousPage}
            >
                <Zap size={16} className="mr-1"/>   ← Previous
            </button>
            <button
                className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center"
                onClick={goToNextPage}
            >
                <Zap size={16} className="mr-1"/> Next →
            </button>
        </div>
    );
};

// Standalone success function using window.location
export const createSuccessHandler = () => {
    return () => {
        const currentPath = window.location.pathname;
        const currentPageMatch = currentPath.match(/\/swplayground\/(\d+)/);
        const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;
        console.log("Success! Moving to next page...");
        window.location.href = `/swplayground/${currentPage + 1}`;
    };
};