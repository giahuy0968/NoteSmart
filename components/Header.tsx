import React from 'react';
import { BookOpenCheck } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900 border-b border-slate-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <BookOpenCheck className="h-8 w-8 text-primary"/>
                        <span className="text-2xl font-bold text-white">MindDeckNote</span>
                    </div>
                    {/* Placeholder for future actions like settings or user profile */}
                </div>
            </div>
        </header>
    );
};

export default Header;