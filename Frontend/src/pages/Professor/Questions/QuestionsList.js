import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import QuestionListSkeleton from '../../../components/Skeletons/QuestionsListSkeleton';
import { fetchAPI } from '../../../Scripts/Axios';
import DeleteQuestionConfirmationModal from '../../../components/Modal/DeleteQuestionConfirmationModal';
import { deleteAPI } from '../../../Scripts/Axios';
//This is used on Questions page to display the list of Questions
function QuestionsList({ apiRoute, type }) {

    const [Questions, setQuestions] = useState(null);                                                                               // This state will store the Questions array fetched from the server
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);                                                      // This state will be used to show/hide the confirmation modal
    const [nameOfQuestionSelectedToDelete, setNameOfQuestionSelectedToDelete] = useState(null);                                     // This state will store the id of the Question to be deleted
    const [includedInAssignmentsArray, setIncludedInAssignmentsArray] = useState([]);                                               // This state will store the array of assignments in which the selected to delete Question is included
    const [DeleteId, setDeleteId] = useState(null);                                                                                 // This state will store the id of the Question to be deleted

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

    //This function will be called when the delete button is pressed next to any Question
    const DeleteButtonPressed = async (curQuestionName, deleteId) => {
        setNameOfQuestionSelectedToDelete(curQuestionName); // Set the current Question Name to the state
        setDeleteId(deleteId);
        setShowConfirmationModal(true); // Show the confirmation modal
    }
    //This function will be called when the close button is pressed on the confirmation modal, it resets the states
    const CloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setDeleteId(null);
        setIncludedInAssignmentsArray([]);
        setNameOfQuestionSelectedToDelete(null);
    }

    //This function will be called when the delete button is pressed on the confirmation modal
    const handleDelete = async () => {
        try {
            const response = await deleteAPI(`/professors/deleteQuestion/${DeleteId}`);
            console.log(response.data);
            const { success, assignments, message } = response.data;
            if (success) {
                toast.success(message);
                setTimeout(() => window.location.reload(), 1000);
            }
            else {
                if (assignments) {
                    setIncludedInAssignmentsArray(assignments);
                    toast.info(message);
                } else {
                    toast.error(message);
                }
            }
        }
        catch (err) {
            toast.error(`error while deleting Question, error ${err.message}`);
        }
    }

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

                            {(type === "MyQuestions") ? (Questions.map((question, index) => (

                                <div className="row" key={index}>
                                    <div className="col py-0 my-1">
                                        <ListGroup.Item action className="d-flex justify-content-between align-items-center mb-2 rounded h-fit" onClick={() => window.location.href = `/Question/Full/${question._id}`}>
                                            <div className="d-flex justify-content-end align-items-center" style={{ height: "25px" }}>
                                                {question.QuestionName}
                                            </div>
                                        </ListGroup.Item>
                                    </div>
                                    <div className="col-auto p-0 my-1 d-flex justify-content-center align-items-center">
                                        <ListGroup.Item action className="d-flex justify-content-between align-items-center mb-2 rounded h-fit" onClick={() => DeleteButtonPressed(question.QuestionName, question._id)}>
                                            <div className="d-flex justify-content-end align-items-center" style={{ height: "25px" }}>
                                                <FontAwesomeIcon icon={faTrash} className='mx-1' />
                                            </div>
                                        </ListGroup.Item>
                                    </div>

                                </div>
                            ))) : (Questions.map((question, index) => (

                                <div className="row" key={index}>
                                    <div className="col py-0 my-1">
                                        <ListGroup.Item action className="d-flex justify-content-between align-items-center mb-2 rounded h-fit" onClick={() => window.location.href = `/Question/Full/${question._id}`}>
                                            <div className="d-flex justify-content-end align-items-center" style={{ height: "25px" }}>
                                                {question.QuestionName}
                                            </div>
                                        </ListGroup.Item>
                                    </div>
                                </div>
                            )))
                            }
                        </div>
                        <hr />
                    </ListGroup>
                    <DeleteQuestionConfirmationModal show={showConfirmationModal} handleClose={CloseConfirmationModal} handleDelete={handleDelete} Label={nameOfQuestionSelectedToDelete} includedInAssignmentsArray={includedInAssignmentsArray} />
                </>
            )}
        </>
    )
}

export default QuestionsList;