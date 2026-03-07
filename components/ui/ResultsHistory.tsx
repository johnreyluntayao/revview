import { Card, ComboBox } from '@/lib/client-imports';
import React from 'react';
import ScoreRecord from './ScoreRecord';

// Mock data (replace with real data fetching in production)
const mockHistory = [
  {
    title: 'Numerical Ability',
    difficulty: 'Medium',
    items: 20,
    score: 18,
    time: '18:45',
    date: 'Feb 3, 2024',
  },
  {
    title: 'Analytical Ability',
    difficulty: 'Hard',
    items: 25,
    score: 20,
    time: '19:32',
    date: 'Feb 1, 2024',
  },
  {
    title: 'Verbal Ability',
    difficulty: 'Medium',
    items: 25,
    score: 19,
    time: '20:27',
    date: 'Jan 28, 2024',
  },
  {
    title: 'General Information',
    difficulty: 'Medium',
    items: 30,
    score: 21,
    time: '18:20',
    date: 'Jan 25, 2024',
  },
  {
    title: 'All Categories',
    difficulty: 'Easy',
    items: 80,
    score: 67,
    time: '24:10',
    date: 'Jan 20, 2024',
  },
];

const ResultsHistory = () => {
  const categories = [
    'All Categories',
    'Numerical Ability',
    'Analytical Ability',
    'Verbal Ability',
    'General Information',
    'Abstract Reasoning',
    'Spatial Reasoning',
  ];

  const sortOptions = [
    'Newest first',
    'Oldest first',
    'Highest score',
    'Lowest score',
    'Most recent test',
  ];

  return (
    <div className="w-full px-4 py-6 md:py-8 lg:py-10 flex flex-col gap-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Results History
        </h1>
        <p className="text-muted-foreground">
          View your past attempts and track your progress
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
          <ComboBox
            options={categories}
            placeholder="History Category..."
            label="Category"
            size="md"
            isSearchable={true}
          />
       
          <ComboBox
            options={sortOptions}
            placeholder="Sort by..."
            label="Sort"
            size="md"
            isSearchable={false}
          />
      </div>

      {/* Test Records */}
      <div className="w-full">
        {mockHistory.map((record, index) => (
          <ScoreRecord
            key={index}
            title={record.title}
            difficulty={record.difficulty}
            items={record.items}
            score={record.score}
            time={record.time}
            date={record.date}
          />
        ))}
      </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 w-full">
          {/* Average Score - highlight variant */}
          <Card
            variant="highlight"
            title="Average Score"
            value="82%"
            subValue="Across all attempts"
            textColor="text-primary"
            className="bg-primary/5 border-primary/20"
          />

          {/* Quizzes Completed - data variant */}
          <Card
            variant="highlight"
            title="Quizzes Completed"
            value="7"
            className="bg-background"
          />

          {/* Best Score - highlight variant */}
          <Card
            variant="highlight"
            title="Best Score"
            value="90%"
            subValue="Numerical Ability"
            textColor="text-success"
            className="bg-success/5 border-success/20"
          />
        </div>
      </div>
  );
};

export default ResultsHistory;