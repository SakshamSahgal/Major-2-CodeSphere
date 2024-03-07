import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CreateAssignmentNavtabs from "./CreateAssignmentNavtabs";
import axios from "axios";
import { toast } from "react-toastify";

function CreateAssignmentModal() {
    const [showModal, setShowModal] = useState(false);
    const [Batches, setBatches] = useState([]); //this will be fetched from the database eg - [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10]
    const [MyQuestions, setMyQuestions] = useState([]);
    const [OtherQuestions, setOtherQuestions] = useState([]);

    useEffect(() => {

        const fetchBatches = async () => {
            try {
                const response = await axios(`/getBatches`, { withCredentials: true });

                if (response.data.success)
                    setBatches(response.data.Batches);
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                // if the status if 401 then redirect to home
                if(err.response && err.response.status === 401)
                {
                    localStorage.clear(); //clear the local storage
                    window.location = "/"; //redirect to home
                }
                toast.error(`error while fetching Batches, error ${err.message}`);
            }
        };

        const fetchMyQuestions = async () => {
            try {
                const response = await axios(`/professors/getMyQuestions`, { withCredentials: true });
                if (response.data.success) {
                    console.log(response.data.Questions);
                    setMyQuestions(response.data.Questions);
                }
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                toast.error(`error while fetching MyQuestions, error ${err.message}`);
            }
        }

        const fetchOtherQuestions = async () => {
            try {
                const response = await axios(`/professors/getOtherQuestions`, { withCredentials: true });
                if (response.data.success) {
                    console.log(response.data.Questions);
                    setOtherQuestions(response.data.Questions);
                }
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                toast.error(`error while fetching OtherQuestions, error ${err.message}`);
            }
        }

        fetchBatches();
        fetchMyQuestions();
        fetchOtherQuestions();
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <Button variant="primary" className="w-100" onClick={toggleModal}> Create Assignment </Button>

            <Modal show={showModal} onHide={toggleModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateAssignmentNavtabs activeTab="OverviewTab" Batches={Batches} MyQuestions={MyQuestions} OtherQuestions={OtherQuestions} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModal}> Close </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateAssignmentModal;
