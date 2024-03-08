import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuestionListSkeleton from '../../../components/Skeletons/QuestionsListSkeleton';
import PreviewQuestionModal from '../../../components/Modal/PreviewQuestionModal';

//This is used on Questions page to display the list of Questions
function QuestionsList({ apiRoute }) {
    const [Questions, setQuestions] = useState(null);               // This state will store the Questions array fetched from the server
    const [selectedQuestion, setSelectedQuestion] = useState(null); // This state will store the selected question
    const [modalShow, setModalShow] = useState(false);            // This state will control the visibility of the modal

    //this will fetch the Questions from the server as soon as the component is mounted
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

    const openModal = (question) => {
        setSelectedQuestion(question);
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
    };


    return (
        <>
            {Questions === null ? ( // Display skeleton if Questions is null
                <QuestionListSkeleton count={3} />
            ) : Questions.length === 0 ? ( // Display no Questions if Questions is an empty array
                <p style={{ color: "white" }} className='text-center'>No Questions</p>
            ) : (
                <>
                    <ListGroup>
                        <hr />
                        {Questions.map((question, index) => (
                            <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2 rounded" onClick={() => openModal(question)}>
                                {question.QuestionName}
                                <FontAwesomeIcon icon={faEye} className='mx-1' />
                            </ListGroup.Item>
                        ))}
                        <hr />
                    </ListGroup>
                    <PreviewQuestionModal show={modalShow} onClose={closeModal} title={selectedQuestion?.QuestionName} _id={selectedQuestion?._id} />
                </>

            )}
        </>
    )
}

export default QuestionsList;