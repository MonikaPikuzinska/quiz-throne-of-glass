import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FinishCard from './FinishCard';
import { selectAllQuestion, fetchNewQuestion } from '../actions/questionActions';
import { selectAllAnswer, fetchNewAnswer } from '../actions/answerActions';
import { API } from './API';
import { next } from '../actions';
import { getAnswer } from '../actions/answerActions';
import { Link } from 'react-router-dom'; 
import {useTranslation} from "react-i18next";

function Quiz() {
    const {t, i18n} = useTranslation('common');
    const dispatch = useDispatch();

    const book = useSelector(state => state.book);
    const lang = useSelector(state => state.lang);
    
    const color = useSelector(state => state.color);
    const currentQuestion = useSelector(state => state.currentQuestion);
    const APILink = `${API}/${book}/${currentQuestion}`;
    const APILink_ans = `${API}/${book}_ans/${currentQuestion}`;
    const questionStatus = useSelector((state) => state);


    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState('');
    const [myAnswer, setMyAnswer] = useState(0);
    const [counter, setCounter] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [rightAns, setRightAns] = useState(false);
    const [quizLen, setQuizLen] = useState(0);

    const handleChangeQuestion = () => {
        dispatch(fetchNewAnswer(APILink_ans))
        if(questionStatus.answer.length>0 && myAnswer===questionStatus.answer[0].answer){
          dispatch(next());
          setCounter(counter+1);
          dispatch(fetchNewQuestion(APILink));
        }
        dispatch(next());
        dispatch(fetchNewQuestion(APILink))
        let opt = document.querySelectorAll('.option');
        opt.forEach(o=>{
            o.classList.remove("bg-green-200")
            o.classList.remove("bg-red-200")
        });
      };

    useEffect(() => {
        dispatch(fetchNewQuestion(APILink))
    },[]);

    const handleCheckAnswer = async (myAnswer, i) => {
        dispatch(fetchNewAnswer(APILink_ans))
        setMyAnswer(options.indexOf(myAnswer));
        if (questionStatus.answer.length>0 && myAnswer===questionStatus.answer[0].answer){
            let element = document.getElementById(i);
            element.classList.toggle("bg-green-200");
        } else if (questionStatus.answer.length>0) {
            let element = document.getElementById(i);
            element.classList.toggle("bg-red-200");
            let element2 = document.getElementById(questionStatus.answer[0].answer);
            element2.classList.toggle("bg-green-200");
        };
    };

    const handleFinish = async()=>{
        setIsFinished(true);
        dispatch(fetchNewAnswer(APILink_ans))
        if(questionStatus.answer.length>0 && myAnswer===questionStatus.answer[0].answer){
          setCounter(counter+1);
        }
    };

    return (
        
        (isFinished)? 
            <FinishCard counter={counter}/>
         :<> {       
            questionStatus.question.length>0?
                <div className="flex flex-col">
                    <button className="italic flex-grow-0 w-36 font-bold border border-gray-700 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-gray-800 focus:outline-none focus:shadow-outline"><Link to={'/'}>{t(`quiz.main`)}</Link></button>
                    <h2 className={`p-4 text-center self-center block italic font-bold text-8xl text-${color}-400`}>{t(`welcome.${book}`)}</h2>
                    <div className="flex flex-col self-center p-8 m-8 shadow-2xl">
                    <h2>{currentQuestion}  / {questionStatus.question[0].all_question} </h2>
                    <h1 className="text-center p-2 text-xl block italic font-bold">{questionStatus.question[0].question[lang]} </h1>
                    {questionStatus.question[0].options[lang].map((option, i)=> (
                    <div id={i} onClick={()=>handleCheckAnswer(option, i)} className={rightAns ? "option text-center p-4 cursor-pointer text-xl block bg-gray-700" : "option text-center cursor-pointer p-4 text-xl block "} >{option}</div>
                    ))}
                    {currentQuestion<questionStatus.question[0].all_question ?
                        <button className="self-center italic flex-grow-0 w-36 font-bold border border-gray-700 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                        onClick={handleChangeQuestion}
                        >
                            {t(`quiz.next`)}
                        </button> :
                        <button className="self-center italic flex-grow-0 w-36 font-bold border border-gray-700 text-gray-700 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-gray-800 focus:outline-none focus:shadow-outline" onClick={handleFinish}>{t(`quiz.finish`)}</button>}
                    </div>
                </div>:'Loading...'
            }
          </>
        
    );
}

export default Quiz;