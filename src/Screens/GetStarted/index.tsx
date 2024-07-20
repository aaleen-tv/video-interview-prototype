import React, { useState, useEffect } from 'react';
import { Header, PrimaryButton, HighlightPoint, PointerWise } from '../../Components';
import Colors from '../../Utils/Colors';
import Routes from '../../Utils/Routes';
import { doList, dontList } from '../../Utils/commonJSON';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { uploadWorkerUrl, openaiUrl } from '../../Utils/Services';

interface Question {
    id: number;
    questionText: string;
    // Add other relevant fields
}

const GetStarted = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        // handleGenerateQuestions();
        handleGetQuestionsByTestId();
    }, []);

    const handleGetQuestionsByTestId = async () => {
        setLoading(true)
        const postData = {
            screeningTestId: 1
        };
        try {
            const response = await axios.post(`https://hono-r2-upload.aaleenmirza110.workers.dev/getQuestionsByTestId`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setQuestions(response.data.data);
            setLoading(false)
            console.log('Questions received:', response.data.data);
        } catch (error) {
            console.error('Error generating questions:', error);
        }
    };

    const handleGenerateQuestions = async () => {
        const postData = {
            field: "React",
            experience: "2"
        };
        try {
            const response = await axios.post<Question[]>(`${openaiUrl}/generateQuestionsByParams`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setQuestions(response.data);
            console.log('Questions generated successfully:', response.data);
        } catch (error) {
            console.error('Error generating questions:', error);
        }
    };

    return (
        loading ? <div className="loader-container"><div className="loader"></div></div> :
            <div className='flex flex-col'>
                <Header />
                <div className='flex flex-col items-start' style={{ padding: '20px 40px' }}>
                    <div style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 16, color: Colors.newBlack }}>
                        Hello Aaleen Mirza
                    </div>
                    <div className='w-full text-start' style={{ fontSize: 20, color: "#BBBBBB" }}>This screening will cover your communication skills as well as your technical skills for the role of <span style={{ color: Colors.newBlack, fontWeight: 'bold' }}>“Full Stack Developer”</span> for NetDev.</div>
                    <div className='flex flex-row'>
                        <HighlightPoint title={'10 Questions'} />
                        <HighlightPoint title={'2 minutes per question'} />
                        <HighlightPoint title={'Approx 30 mins'} />
                    </div>

                    <div className='flex flex-row'>
                        <PointerWise title={"Do's"} list={doList} theme={"default"} />
                        <PointerWise title={"Dont's"} list={dontList} theme={"error"} />
                    </div>

                    <div className='flex absolute' style={{ bottom: 50, left: 30 }}>
                        <PrimaryButton title={"Start Interview"} handleClick={() => { navigate(Routes.screening, { state: { questions: questions } }) }} />
                    </div>

                </div>
            </div>
    )
}

export default GetStarted;