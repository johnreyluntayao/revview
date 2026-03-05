import React from 'react';
import Chip from '../atoms/Chip';

interface ScoreEntry {
    category: string;
    score: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    time: string;
    date: string;
}

const recentScores: ScoreEntry[] = [
    {
        category: 'Numerical Ability',
        score: '18/20',
        difficulty: 'Medium',
        time: '18:45',
        date: 'Feb 3, 2024',
    },
    {
        category: 'Analytical Ability',
        score: '16/20',
        difficulty: 'Hard',
        time: '19:32',
        date: 'Feb 1, 2024',
    },
    {
        category: 'Verbal Ability',
        score: '19/25',
        difficulty: 'Medium',
        time: '22:15',
        date: 'Jan 30, 2024',
    },
    {
        category: 'General Information',
        score: '14/20',
        difficulty: 'Medium',
        time: '18:20',
        date: 'Jan 28, 2024',
    },
    {
        category: 'All Categories',
        score: '67/80',
        difficulty: 'Easy',
        time: '34:41',
        date: 'Jan 25, 2024',
    },
];

const RecentScores: React.FC = () => {
    return (
        <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border overflow-hidden">
            {/* Header */}
            <div className=' mb-2 md:mb-4 lg:mb-6'>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                    Performance Overview
                </h1>
            </div>
            

            {/* Table */}
            <div className="overflow-x-auto -mx-2 md:mx-0">
                <table className="w-full min-w-auto text-xs md:text-sm lg:text-base">
                    <thead>
                    <tr className="border-border text-foreground">
                        <th className="px-4 py-3.5 text-left font-medium">Category</th>
                        <th className="px-3 py-3.5 text-center font-medium">Score</th>
                        <th className="px-3 py-3.5 text-center font-medium hidden md:table-cell">Difficulty</th>
                        <th className="px-3 py-3.5 text-center font-medium hidden lg:table-cell">Time</th>
                        <th className="px-4 py-3.5 text-right font-medium hidden lg:table-cell">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {recentScores.map((item, index) => (
                        <tr
                        key={item.category + item.date}
                        className={index === recentScores.length - 1 ? 'font-medium' : ''}
                        >
                        <td className="px-4 py-4 whitespace-nowrap">{item.category}</td>
                        <td className="px-3 py-4 text-center font-medium">
                            <Chip text={item.score} className="text-primary bg-primary/20" />
                        </td>
                        <td className="px-3 py-4 text-center hidden md:table-cell">{item.difficulty}</td>
                        <td className="px-3 py-4 text-center text-muted-foreground hidden lg:table-cell">
                            {item.time}
                        </td>
                        <td className="px-4 py-4 text-right text-muted-foreground hidden lg:table-cell">
                            {item.date}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
        </div>
    );
};

export default RecentScores;