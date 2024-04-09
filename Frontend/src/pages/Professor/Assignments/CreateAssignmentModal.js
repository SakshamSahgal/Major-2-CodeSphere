import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CreateAssignmentNavtabs from "./CreateAssignmentNavtabs";
import { fetchData } from "../../../Scripts/Axios";

function CreateAssignmentModal() {
    const [showModal, setShowModal] = useState(false);
    const [Batches, setBatches] = useState([]); //this will be fetched from the database eg - [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10]
    const [MyQuestions, setMyQuestions] = useState([]);
    const [OtherQuestions, setOtherQuestions] = useState([]);

    useEffect(() => {
        fetchData("/getBatches", setBatches, "Batches", "Error while fetching Batches");
        fetchData("/professors/getMyQuestions", setMyQuestions, "Questions", "Error while fetching MyQuestions");
        fetchData("/professors/getOtherQuestions", setOtherQuestions, "Questions", "Error while fetching OtherQuestions");
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
