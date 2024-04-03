import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import QuestionListSkeleton from '../../../components/Skeletons/QuestionsListSkeleton';
import fetchAPI from '../../../Scripts/Axios';
import DeleteConfirmationModal from '../../../components/Modal/DeleteConfirmationModal';

//This is used on Questions page to display the list of Questions
function QuestionsList({ apiRoute }) {
    const [Questions, setQuestions] = useState(null);               // This state will store the Questions array fetched from the server
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // This state will be used to show/hide the confirmation modal
    //this will fetch the Questions from the server as soon as the component is mounted
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetchAPI(apiRoute);
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
                <>
                    <ListGroup>
                        <hr />
                        <div className='container'>

                            {Questions.map((question, index) => (
                                <div className="row" key={index}>
                                    <div className="col py-0 my-1">
                                        <ListGroup.Item action className="d-flex justify-content-between align-items-center mb-2 rounded h-fit"  onClick={() => window.location.href = `/Question/Full/${question._id}`}>
                                            <div className="d-flex justify-content-end align-items-center" style={{ height: "25px" }}>
                                                {question.QuestionName}
                                            </div>
                                        </ListGroup.Item>
                                    </div>
                                    <div className="col-auto p-0 my-1 d-flex justify-content-center align-items-center">
                                        <ListGroup.Item action className="d-flex justify-content-between align-items-center mb-2 rounded h-fit" onClick={() => { setShowConfirmationModal(true) }}>
                                            <div className="d-flex justify-content-end align-items-center" style={{ height: "25px" }}>
                                                <FontAwesomeIcon icon={faTrash} className='mx-1' />
                                            </div>
                                        </ListGroup.Item>
                                    </div>

                                </div>
                            ))}

                        </div>
                        <hr />
                    </ListGroup>
                    <DeleteConfirmationModal show={showConfirmationModal} handleClose={() => setShowConfirmationModal(false)} handleDelete={() => console.log("Delete")} Label="Question" />
                </>

            )}
        </>
    )
}

export default QuestionsList;