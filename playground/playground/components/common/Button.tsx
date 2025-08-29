import React, {FC, ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    uiType?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({uiType = 'primary', children, className = '', ...props}) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const typeClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    };

    return (
        <button
            className={`${baseClasses} ${typeClasses[uiType]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
