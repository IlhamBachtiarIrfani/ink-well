import HeaderComponent from '@/components/common/header'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import React from 'react'

export default function CreateQuizPage() {
    return (
        <div>
            <HeaderComponent />
            <main className='container max-w-3xl mx-auto px-5 flex flex-col py-8 gap-8'>
                <div className='relative overflow-hidden bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
                    <div className='absolute rotate-45 top-4 -right-16 w-52 h-10 bg-red-400' />

                    <h1 className='font-black text-3xl focus:outline-none' contentEditable>Tech Titans: The Silicon Valley Saga</h1>
                    <p className='focus:outline-none' contentEditable>This quiz will test your knowledge about the history of technology giants, their founders, and the revolutionary products they’ve created. From the garages of Silicon Valley to the skyscrapers of Manhattan, get ready to dive into the world of tech innovation!</p>

                    <div className='flex gap-5'>
                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                avg_pace
                            </span>
                            <input
                                type='number'
                                min={1}
                                className='w-full focus:outline-none h-10'
                            />
                            <p className='flex-none whitespace-nowrap'>
                                Minutes
                            </p>
                        </div>

                        <div className='flex-1 border border-black rounded-full flex items-center gap-3 px-5'>
                            <span className='material-symbols-rounded'>
                                rewarded_ads
                            </span>
                            <input
                                type='number'
                                min={1}
                                max={100}
                                className='w-full focus:outline-none h-10'
                            />
                            <p className='flex-none whitespace-nowrap'>
                                % Pass Score
                            </p>
                        </div>
                    </div>
                </div>

                {
                    [1, 2, 3, 4, 5].map((item) => {
                        return <div key={item} className='bg-white p-10 rounded-2xl border-b-4 border-black flex flex-col gap-5'>
                            <div className='flex gap-3 items-center'>
                                <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                                    <span className='material-symbols-rounded'>
                                        drag_indicator
                                    </span>
                                </div>
                                <h2 className='grow font-black text-xl text-red-400'>QUESTION {item}</h2>

                                <ButtonComponent
                                    type={ButtonType.SMALL_DARK_OUTLINED}
                                    title='Delete'
                                    icon={<span className='material-symbols-rounded  text-lg'>
                                        delete
                                    </span>}
                                />
                                <ButtonComponent
                                    type={ButtonType.SMALL_DARK}
                                    title='Edit'
                                    icon={<span className='material-symbols-rounded text-lg'>
                                        edit
                                    </span>}
                                />
                            </div>

                            <div className='text-lg'>
                                <p>Apa yang dimaksud dengan <b>Enkripsi</b> dan bagaimana pengaruhnya terhadap <i>pengembangan sistem keamanan?</i></p>
                            </div>

                            <p className='font-black'>Answer Key :</p>

                            <p>Enkripsi adalah proses konversi informasi atau data menjadi kode rahasia untuk mencegah akses unauthorised. Pengaruhnya terhadap pengembangan sistem keamanan adalah peningkatan integritas dan kerahasiaan data.</p>

                            <div className='flex items-start gap-3 flex-wrap'>
                                <div className='bg-black text-white rounded-full pl-3 pr-5 h-8 flex  items-center gap-2 font-bold'>
                                    <span className='material-symbols-rounded'>
                                        new_releases
                                    </span>
                                    40 Point
                                </div>

                                {["Enkripsi", "Pengembangan Sistem Keamanan", "Integritas Data"].map((item) => {
                                    return <span key={item} className='bg-red-400 rounded-full px-5 py-1 h-8 font-bold'>{item}</span>
                                })}
                            </div>
                        </div>
                    })
                }
            </main>
        </div>
    )
}
