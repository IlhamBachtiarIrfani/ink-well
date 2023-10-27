import HeaderComponent from '@/components/common/header'
import ButtonComponent, { ButtonType } from '@/components/input/button'
import React from 'react'

export default function AdminPage() {
  return (
    <div>
      <HeaderComponent />
      <main className='container max-w-5xl px-5 mx-auto flex flex-col py-8 gap-8'>
        {
          [0, 1, 2, 3, 4, 5].map((item) => {
            return <div key={item} className='bg-white p-10 rounded-2xl border-b-4 border-b-black flex overflow-hidden'>
              <div className='grow flex flex-col gap-5'>
                <h1 className='text-3xl font-black'>Galactic Knowledge Challenge</h1>
                <div className='flex gap-10 font-bold text-red-400'>
                  <div className='flex items-center gap-3'>
                    <span className='material-symbols-rounded'>cast</span>
                    <p>ON GOING</p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <span className='material-symbols-rounded'>avg_pace</span>
                    <p>90 MINUTES</p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <span className='material-symbols-rounded'>live_help</span>
                    <p>5 QUESTIONS</p>
                  </div>
                </div>
              </div>

              {/* <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-black before:rotate-12 before:-z-10 z-10'>
                <ButtonComponent
                  type={ButtonType.LIGHT}
                  title='Supervise'
                  icon={<span className='material-symbols-rounded'>domino_mask</span>}
                />
              </div> */}

              {/* <div className='relative flex items-center before:absolute before:-inset-20 before:-left-10 before:bg-cyan-300 before:rotate-12 before:-z-10 z-10'>
                <ButtonComponent
                  type={ButtonType.DARK}
                  title='Open Exam'
                  icon={<span className='material-symbols-rounded'>east</span>}
                />
              </div> */}

              <div className='relative flex items-center'>
                <ButtonComponent
                  type={ButtonType.DARK_OUTLINED}
                  title='See Result'
                  icon={<span className='material-symbols-rounded'>query_stats</span>}
                />
              </div>
            </div>
          })
        }
      </main>
    </div>
  )
}
