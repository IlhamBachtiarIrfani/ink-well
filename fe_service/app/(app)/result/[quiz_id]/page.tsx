import React from 'react';
import QuestionStats from './question_stats';
import ScoreDistribution from './score_distribution';
import Overview from './overview';
import ScoreTable from './score_table';
import { faker } from '@faker-js/faker'
import BoxPlotChart from '@/components/chart/box-plot.chart';

export default function Page() {
    return (
        <main className='container max-w-7xl px-5 mx-auto flex flex-col py-8 gap-8'>
            <Overview />
            <ScoreDistribution />

            <div className='flex flex-col gap-8'>
                {[1, 2, 3, 4, 5].map((item) => {
                    const labels = ["Answer Key", ...Array.from({
                        length: faker.number.int({ min: 2, max: 6 })
                    }).map(() => faker.commerce.department())]

                    return (
                        <div key={item} className='flex flex-col gap-8'>
                            <h1 className='text-3xl font-black'>Question {item}</h1>
                            <div className='flex gap-5' >
                                <QuestionStats labels={labels} />
                                <ScoreDistribution />
                            </div>

                            <div className='relative p-10 bg-white border-b-4 border-black rounded-2xl flex flex-col gap-5 z-10 overflow-hidden'>
                                <h1 className='text-xl mb-2 font-black'>Score Weight Overview</h1>
                                <div className='w-full aspect-video max-h-80'>
                                    <BoxPlotChart labels={labels} />
                                </div>
                            </div>

                            <ScoreTable labels={labels} />
                        </div>
                    )
                })}
            </div>
        </main>
    );
}
