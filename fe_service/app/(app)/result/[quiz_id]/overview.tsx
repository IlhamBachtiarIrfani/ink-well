"use client"

import BoxPlotChart from '@/components/chart/box-plot.chart';
import React from 'react';

const labels = ['All', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6'];

export default function App() {
    return (
        <div className='flex-1 relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
            <h1 className='flex-1 text-5xl font-black'>Score Overview</h1>
            <p className='text-gray-500 max-w-3xl'>Shows the lowest and highest scores, the most common score (median), and how spread out the scores are. It’s like a scoreboard that gives you a quick overview of everyone’s performance.</p>
            <div className='w-full aspect-video max-h-96'>
                <BoxPlotChart labels={labels} />
            </div>
        </div>
    );
}
