import React from "react";
import { Modal, Button } from "react-bootstrap";


function UnsubmitAssignmentConfirmationModal({ show, handleClose, handleUnsubmit, Label }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to Unsubmit <b>{Label}</b>?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleUnsubmit}>
                    Unsubmit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UnsubmitAssignmentConfirmationModal;