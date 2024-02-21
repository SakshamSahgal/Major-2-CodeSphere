import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CreateAssignmentNabtabs from "./CreateAssignmentNabtabs";

function CreateAssignmentModal() {
    const [showModal, setShowModal] = useState(false);

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
                    <CreateAssignmentNabtabs activeTab="OverviewTab" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModal}> Close </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateAssignmentModal;
