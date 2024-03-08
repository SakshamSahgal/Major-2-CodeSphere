import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuestionListSkeleton from '../../../components/Skeletons/QuestionsListSkeleton';

function QuestionsList({ apiRoute }) {
    const [Questions, setQuestions] = useState(null);
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios(apiRoute, { withCredentials: true });
                if (response.data.success) {
                    console.log(response.data.Questions);
                    setQuestions(response.data.Questions);
                }
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                toast.error(`error while fetching Questions, error ${err.message}`);
            }
        }
        fetchQuestions();
    }, []);

    return (
        <>
            {Questions === null ? ( // Display skeleton if Questions is null
                <QuestionListSkeleton count={3} />
            ) : Questions.length === 0 ? ( // Display no Questions if Questions is an empty array
                <p style={{ color: "white" }} className='text-center'>No Questions</p>
            ) : (
                <ListGroup>
                    <hr />
                    {Questions.map((question, index) => (
                        <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2">
                            {question.QuestionName}
                            <FontAwesomeIcon icon={faEye} className='mx-1' />
                        </ListGroup.Item>
                    ))}
                    <hr />
                </ListGroup>
            )}
        </>
    )
}

export default QuestionsList;