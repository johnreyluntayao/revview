"use client"

import { Card, ComboBox, ScoreRecord } from '@/lib/client-imports';
import React, { useState } from 'react';

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
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
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          Results History
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
          View your past attempts and track your progress
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-5 lg:gap-6 p-4 md:p-5 lg:p-6 border border-border rounded-xl">
          <ComboBox
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="History Category..."
            label="Category"
            isSearchable={true}
          />
       
          <ComboBox
            options={sortOptions}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Sort by..."
            label="Sort"
            isSearchable={false}
          />
      </div>

      {/* Test Records */}
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 max-h-187.5 overflow-auto">
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
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6 w-full">
          {/* Average Score - highlight variant */}
          <Card
            variant="highlight"
            title="Average Score"
            value="82%"
            textColor='text-primary'
          />

          {/* Quizzes Completed - data variant */}
          <Card
            variant="highlight"
            title="Quizzes Completed"
            value="7"
            textColor='text-secondary'
          />

          {/* Best Score - highlight variant */}
          <Card
            variant="highlight"
            title="Best Score"
            value="90%"
            textColor='text-success'
          />
        </div>
      </div>
  );
};

export default ResultsHistory;