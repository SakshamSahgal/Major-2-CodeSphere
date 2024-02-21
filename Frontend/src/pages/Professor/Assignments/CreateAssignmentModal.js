import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CreateAssignmentNabtabs from "./CreateAssignmentNabtabs";
import axios from "axios";
import { toast } from "react-toastify";

function CreateAssignmentModal() {
    const [showModal, setShowModal] = useState(false);
    const [Batches, setBatches] = useState([]); //this will be fetched from the database eg - [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10]

    useEffect(() => {

        const fetchBatches = async () => {
            const response = await axios(`/getBatches`, { withCredentials: true });
            if (response.data.success)
                setBatches(response.data.Batches);
            else {
                toast.error(response.data.message);
            }
        };
        fetchBatches();
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <Button variant="primary" onClick={toggleModal}> Create Assignment </Button>

            <Modal show={showModal} onHide={toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateAssignmentNabtabs activeTab="OverviewTab" Batches={Batches} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModal}> Close </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateAssignmentModal;
