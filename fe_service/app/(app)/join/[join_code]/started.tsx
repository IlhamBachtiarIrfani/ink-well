import CountdownComponent from '@/components/common/countdown'
import ButtonComponent from '@/components/input/button'
import RichTextInputComponent from '@/components/input/richText.input'
import { QuestionEntity } from '@/entities/question.entity'
import React, { useEffect, useState } from 'react'

interface QuizStartedStateView {
  questionData: QuestionEntity[],
  finishTime: Date,
  onResponseChange: (question_id: string, response: string) => void
  onStopTyping: (response: string, question_id: string) => void
  onStartTyping: (question_id: string) => void
  onChangeQuestion: (question_id: string) => void
}

export default function QuizStartedStateView(props: QuizStartedStateView) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionEntity | null>(props.questionData[0] ?? 0)

  const [responseList, setResponseList] = useState<string[]>(
    props.questionData.map((item) =>
      item.user_response?.content ?? ""
    )
  )

  useEffect(() => {
    if (!currentQuestion) return
    props.onChangeQuestion(currentQuestion.id)
  }, [currentQuestion])


  function onResponseChange(response: string, index: number) {
    setResponseList((value) => {
      value[index] = response
      return value;
    })
  }

  function onStopTyping(response: string, question_id: string) {
    props.onStopTyping(response, question_id);
    props.onResponseChange(question_id, response);
  }

  function onStartTyping(question_id: string) {
    props.onStartTyping(question_id)
  }

  const currentQuestionIndex = currentQuestion ? props.questionData.indexOf(currentQuestion) : -1

  return (
    <main className='grow container max-w-7xl px-5 py-8 mx-auto flex flex-col lg:flex-row gap-8 items-start'>
      <QuestionList
        questionData={props.questionData}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        finishTime={props.finishTime}
      />
      <QuestionItem
        currentQuestion={currentQuestion}
        index={(currentQuestion && props.questionData.indexOf(currentQuestion)) ?? 0}
        onResponseChange={onResponseChange}
        responseList={responseList}
        onStartTyping={onStartTyping}
        onStopTyping={onStopTyping}
      />
      <div className='w-full flex lg:hidden justify-between'>
        {
          currentQuestion && currentQuestionIndex > 0 &&
          <ButtonComponent title='Prev Question' type='DARK' onClick={() => {
            setCurrentQuestion(props.questionData[currentQuestionIndex - 1])
          }} />
        }
        {
          currentQuestion && currentQuestionIndex < props.questionData.length - 1 &&
          <ButtonComponent title='Next Question' type='DARK' onClick={() => {
            setCurrentQuestion(props.questionData[currentQuestionIndex + 1])
          }} />
        }
      </div>
    </main>
  )
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

interface QuestionListProps {
  questionData: QuestionEntity[]
  currentQuestion: QuestionEntity | null
  setCurrentQuestion: (question: QuestionEntity) => void
  finishTime: Date
}

function QuestionList(props: QuestionListProps) {
  const [mobileQuestionView, setMobileQuestionView] = useState(false)

  function showMobileQuestion() {
    setMobileQuestionView(true)
  }

  function hideMobileQuestion() {
    setMobileQuestionView(false)
  }

  return (
    <div className='bg-white flex-none w-full lg:w-80 rounded-2xl border-b-4 border-black flex flex-col overflow-hidden'>

      <div className='mx-5 lg:mx-10 my-3 lg:my-8 flex items-center justify-between'>
        <CountdownComponent finishTime={props.finishTime} isBig={false} />
        <button onClick={showMobileQuestion} className='bg-black text-white w-12 h-12 rounded-lg flex  lg:hidden items-center justify-center'>
          <span className='material-symbols-rounded'>
            format_list_numbered
          </span>
        </button>
      </div>

      <div className={`fixed ${mobileQuestionView ? '' : 'hidden'} lg:block lg:relative bg-white inset-0 top-20 lg:top-0 mt-3 pt-5 lg:pt-0 lg:mt-0 z-50 lg:z-0 pb-10`}>
        <div className='mx-5 mb-5 flex lg:hidden items-center justify-between'>
          <p className=' font-black text-xl'>Question List</p>
          <button className='flex items-center p-2' onClick={hideMobileQuestion}>
            <span className='material-symbols-rounded'>close</span>
          </button>
        </div>
        {
          props.questionData.map((item, index) => {
            const regex = /(<([^>]+)>)/gi;
            const plainQuestion = item.content.replace(regex, "");

            const activeStyle = "absolute -left-2 top-0 bottom-0 flex items-center font-black text-4xl text-black before:bg-cyan-300 before:absolute before:-inset-2 before:-z-10 before:-rotate-12 select-none transition-all before:transition-all"
            const defaultStyle = "absolute -left-2 top-0 bottom-0 flex items-center font-black text-4xl text-gray-200 before:bg-transparent before:absolute before:-inset-2 before:-translate-x-full before:-z-10 before:-rotate-12 select-none transition-all before:transition-all"

            const isActive = item.id == props.currentQuestion?.id

            function onQuestionClick(event: React.MouseEvent) {
              event.preventDefault()
              props.setCurrentQuestion(item);
              hideMobileQuestion()
            }

            return (
              <div
                key={item.id}
                className='relative py-3 pl-14 pr-8 overflow-hidden z-10 cursor-pointer hover:bg-gray-100'
                onClick={onQuestionClick}
              >
                <div className={isActive ? activeStyle : defaultStyle}>
                  {zeroPad(index + 1, 2)}
                </div>
                <p className='line-clamp-2'>{plainQuestion}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

interface QuestionItemProps {
  currentQuestion: QuestionEntity | null
  responseList: string[]
  index: number
  onResponseChange: (response: string, index: number) => void
  onStopTyping: (response: string, question_id: string) => void
  onStartTyping: (question_id: string) => void
}

function QuestionItem(props: QuestionItemProps) {
  if (!props.currentQuestion) return <></>


  function onResponseChange(response: string) {
    if (!props.onResponseChange) return
    props.onResponseChange(response, props.index);
  }

  function onStartTyping() {
    if (!props.currentQuestion) return

    props.onStartTyping(props.currentQuestion.id);
  }

  function onStopTyping() {
    if (!props.currentQuestion) return

    props.onStopTyping(props.responseList[props.index], props.currentQuestion.id);
  }

  return (
    <div className='flex flex-col grow gap-8'>
      <div className='bg-white p-7 lg:p-10 rounded-2xl border-b-4 border-black'>
        <div className='flex gap-3 items-center'>
          <div className='w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center'>
            <span className='material-symbols-rounded'>
              drag_indicator
            </span>
          </div>
          <h2 className='grow font-black text-xl text-red-400'>QUESTION {props.index + 1}</h2>
        </div>

        <div className='text-lg mt-5' dangerouslySetInnerHTML={{ __html: props.currentQuestion.content }}>
        </div>
      </div>

      <div className='bg-white p-7 pt-5 lg:p-10 lg:pt-8 rounded-2xl border-b-4 border-black'>
        <RichTextInputComponent
          key={props.currentQuestion.id}
          defaultValue={props.responseList[props.index]}
          onInputChange={onResponseChange}
          onStartTyping={onStartTyping}
          onStopTyping={onStopTyping}
        />
      </div>
    </div>
  )
}