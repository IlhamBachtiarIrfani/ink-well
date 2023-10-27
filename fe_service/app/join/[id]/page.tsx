import FooterComponent from '@/components/common/footer'
import HeaderComponent from '@/components/common/header'
import RichTextInputComponent from '@/components/input/rich-text-input'
import React from 'react'

export default function QuizDetailPage() {
    return (
        <div className='min-h-screen flex flex-col gap-8'>
            <HeaderComponent />
            <main className='grow container max-w-7xl px-5 mx-auto flex gap-8 items-start'>
                <QuestionList />
                <QuestionItem />
            </main>
            <FooterComponent />
        </div>
    )
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

function QuestionList() {
    return (
        <div className='bg-white flex-none w-80 rounded-2xl border-b-4 border-black flex flex-col overflow-hidden pb-10'>

            <div className='flex items-center justify-center gap-3 bg-gray-100 py-4 px-5 rounded-2xl mx-10 my-8'>
                <span className='material-symbols-rounded text-5xl icon-bold'>
                    avg_pace
                </span>
                <p className='font-black text-5xl'>90:00</p>
            </div>

            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ,19, 20].map((item) => {
                    const activeStyle = "absolute -left-2 top-0 bottom-0 flex items-center font-black text-4xl text-black before:bg-cyan-300 before:absolute before:-inset-2 before:-z-10 before:-rotate-12 select-none"
                    const defaultStyle = "absolute -left-2 top-0 bottom-0 flex items-center font-black text-4xl text-gray-200 select-none"

                    const isActive = item == 1

                    return (
                        <div key={item} className='relative py-3 pl-14 pr-8 overflow-hidden z-10 cursor-pointer hover:bg-gray-100'>
                            <div className={isActive ? activeStyle : defaultStyle}>
                                {zeroPad(item, 2)}
                            </div>
                            <p className='line-clamp-2'>Apa yang dimaksud dengan Enkripsi dan bagaimana pengaruhnya terhadap pengembangan sistem keamanan?</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

function QuestionItem() {
    return (
        <div className='flex flex-col grow gap-8'>
            <div className='bg-white p-10 rounded-2xl border-b-4 border-black'>
                <div className='flex gap-3 items-center'>
                    <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
                        <span className='material-symbols-rounded'>
                            drag_indicator
                        </span>
                    </div>
                    <h2 className='grow font-black text-xl text-red-400'>QUESTION 1</h2>
                </div>

                <div className='text-lg mt-5'>
                    <p>Apa yang dimaksud dengan <b>Enkripsi</b> dan bagaimana pengaruhnya terhadap <b>pengembangan sistem keamanan?</b></p>
                </div>
            </div>

            <RichTextInputComponent />
        </div>
    )
}